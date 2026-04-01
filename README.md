# RudyNote

배우고, 경험하고, 나누고 싶은 것들을 기록하는 개인 블로그.

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Editor | Milkdown Crepe v7 |
| ORM | Prisma v5 |
| Database | PostgreSQL 16 |
| Language | TypeScript 5 |
| Deployment | Docker, GitHub Actions |

---

## 아키텍처

```mermaid
flowchart TD
    Browser["브라우저"]

    subgraph Docker Compose
        App["Next.js\n(ISR + Server Actions)"]
        DB[("PostgreSQL")]
    end

    subgraph GitHub
        GHA["GitHub Actions\nCI/CD"]
        Hub["Docker Hub\nlinux/amd64 · arm64"]
    end

    Browser -- "페이지 요청" --> App
    App -- "캐시 미스 시" --> DB
    DB -- "데이터 반환" --> App
    App -- "완성된 HTML 캐시" --> Browser

    Browser -- "글 작성·수정·삭제\n(Server Action)" --> App
    App -- "revalidatePath()\n캐시 무효화" --> App

    GHA -- "main push → 빌드 & 푸시" --> Hub
    Hub -- "docker compose pull" --> App
```

---

## 데이터 모델

```mermaid
erDiagram
    Post {
        string  id        PK "CUID"
        string  title
        string  content       "마크다운"
        string  category      "카테고리명 직접 저장 (FK 아님)"
        string  tags          "String[] 배열"
        string  image         "nullable"
        string  date
        datetime createdAt
        datetime updatedAt
    }

    Draft {
        string   id       PK "항상 고정값 'draft'"
        string   title
        string   content
        string   category
        string   tags         "String[] 배열"
        string   image        "nullable"
        datetime savedAt
    }

    Category {
        string   id       PK "CUID"
        string   name         "UNIQUE"
        datetime createdAt
    }

    Post }o--o| Category : "name으로 느슨하게 연결\nCategory 삭제 시 → category = ''"
```

---

## 페이지 구조

```mermaid
flowchart LR
    Home["/\n홈 · 글 목록"]
    Detail["/post/[id]\n글 상세 · 편집"]
    Write["/write\n글 작성"]
    Settings["/settings/categories\n카테고리 관리"]

    Home -- "글 클릭" --> Detail
    Home -- "새 글" --> Write
    Home -- "설정" --> Settings
    Detail -- "삭제·작성 완료" --> Home
    Write -- "게시" --> Home
```

---

## 주요 기능

### 글 목록 (홈)
- 전체 글 서버사이드 로딩 후 클라이언트에서 필터링 (`useMemo`)
- 제목·본문·태그 통합 검색, 검색어 하이라이트
- 카테고리 필터, 태그 필터 (복수 선택 가능)
- 작성 중인 임시저장 글이 있으면 상단 배너 표시

### 글 작성
- Milkdown 마크다운 에디터 (코드 하이라이트 포함)
- 제목, 카테고리, 날짜, 태그, 대표 이미지 설정
- **자동 임시저장** — 입력 후 2초 debounce로 Draft 테이블에 저장
- 페이지 재방문 시 임시저장 내용 자동 복원

### 글 상세 · 편집
- 수정 버튼 클릭 시 **인플레이스 편집** (페이지 이동 없음)
- 제목, 본문, 카테고리, 날짜, 태그 수정 가능
- 저장 시 해당 글과 홈 캐시만 선택적으로 재검증

### 카테고리 관리
- 카테고리 추가 · 삭제
- 삭제 시 해당 카테고리를 사용 중인 글의 `category` 필드를 빈 문자열로 자동 초기화

---

## 로컬 개발

### 요구사항
- Node.js 20+
- PostgreSQL 실행 중

### 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 에서 DATABASE_URL 수정

# 3. DB 마이그레이션
npx prisma migrate dev

# 4. 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 명령어

```bash
npm run dev                                  # 개발 서버 (Turbopack)
npm run build                                # 프로덕션 빌드
npm run lint                                 # ESLint 검사

npx prisma migrate dev --name <이름>         # 마이그레이션 생성 및 적용
npx prisma generate                          # Prisma 클라이언트 재생성
npx prisma studio                            # DB GUI
```

---

## Docker 배포

### 환경변수 설정

```bash
cp .env.example .env
```

| 변수 | 설명 |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub 아이디 |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NEXT_PUBLIC_SITE_URL` | 운영 도메인 (SEO, sitemap 기준 URL) |
| `POSTGRES_USER` | DB 계정 |
| `POSTGRES_PASSWORD` | DB 비밀번호 |
| `POSTGRES_DB` | DB 이름 |

### Docker Hub 이미지로 실행

```bash
docker compose pull
docker compose up -d
```

컨테이너 시작 시 `prisma migrate deploy`가 자동 실행됩니다.

### 로컬 빌드로 실행

`docker-compose.yml`의 `image:` 줄을 `build: .`으로 교체 후:

```bash
docker compose up --build -d
```

---

## CI/CD

`main` 브랜치에 push하면 GitHub Actions가 자동으로 Docker Hub에 이미지를 빌드 & 푸시합니다.

```mermaid
flowchart LR
    Push["main 브랜치 push"] --> Build["Docker Buildx\n멀티 스테이지 빌드"]
    Build --> Platforms["linux/amd64\nlinux/arm64"]
    Platforms --> Tags["latest\nsha-xxxxxxx"]
    Tags --> Hub["Docker Hub 푸시"]
```

**필요한 GitHub Repository Secrets**

| Secret | 값 |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub 아이디 |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token (Read & Write) |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃, 공통 metadata · OG · Twitter
│   ├── page.tsx                    # 홈 (ISR revalidate: 0)
│   ├── globals.css                 # Tailwind v4, Milkdown 스타일 오버라이드
│   ├── sitemap.ts                  # /sitemap.xml 동적 생성
│   ├── robots.ts                   # /robots.txt (/write, /settings 차단)
│   ├── post/[id]/
│   │   ├── page.tsx                # 글 상세 (ISR + generateMetadata)
│   │   └── PostDetailWrapper.tsx   # PostDetail dynamic import (ssr: false)
│   ├── write/
│   │   └── page.tsx                # 글 작성 (force-dynamic)
│   └── settings/categories/
│       └── page.tsx                # 카테고리 관리 (force-dynamic)
├── components/
│   ├── layout/Header.tsx
│   ├── post/
│   │   ├── PostFeed.tsx            # 클라이언트 필터링 (useMemo)
│   │   ├── PostList.tsx
│   │   ├── PostCard.tsx            # 검색어 하이라이트
│   │   └── PostDetail.tsx          # 상세 뷰 + 인플레이스 편집
│   ├── editor/
│   │   ├── MilkdownEditor.tsx      # Milkdown Crepe 래퍼 (ssr: false)
│   │   ├── WriteForm.tsx           # 작성 폼, 2초 debounce 자동 임시저장
│   │   └── DraftBanner.tsx         # 임시저장 배너
│   ├── filter/
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── TagFilter.tsx
│   ├── settings/CategoryManager.tsx
│   └── ui/
│       ├── Button.tsx              # primary · secondary · danger
│       └── TagBadge.tsx
└── lib/
    ├── db/index.ts                 # Prisma 싱글톤
    ├── actions/
    │   ├── posts.ts                # createPost · updatePostInPlace · deletePost
    │   ├── draft.ts                # saveDraft · deleteDraft
    │   └── categories.ts           # addCategory · deleteCategory
    ├── readingTime.ts              # readingTime() · summarize()
    └── highlight.ts                # getHighlightParts()
```
