# 남을 위한 AI — 템플릿

한 사람을 위한 웹 서비스를 만들어 공개 주소로 띄우는 틀입니다.
**설치할 것이 없습니다. 브라우저만 있으면 됩니다.**

주소는 `https://내프로젝트이름.pages.dev` 형태로 생깁니다.

---

## 만드는 순서 (처음 한 번, 약 15분)

### 1. 내 레포 만들기
이 레포 맨 위의 초록색 **Use this template → Create a new repository** 를 누릅니다.
이름은 영문 소문자와 하이픈으로. 공개(Public)로 두세요. 무료 사용량이 넉넉합니다.

### 2. Cloudflare 에 연결하기
1. [dash.cloudflare.com](https://dash.cloudflare.com) 가입 (무료)
2. **Workers & Pages → Create → Pages → Connect to Git**
3. 방금 만든 레포 선택 → **Save and Deploy**

1~2분 뒤 주소가 생깁니다. 이때는 아직 AI 가 안 붙어 있습니다.

### 3. AI 켜기
1. 그 프로젝트의 **Settings → Bindings → Add → Workers AI**
2. **Variable name** 에 대문자로 `AI` 입력 → 저장
3. **Deployments** 에서 맨 위 배포의 **Retry deployment**

> 하루 10,000 뉴런까지 무료입니다. 넘으면 과금되는 게 아니라 에러가 나고,
> 세계시 자정(한국 시간 오전 9시)에 초기화됩니다.

### 4. 내 서비스로 바꾸기
깃허브에서 **`functions/_config.js`** 파일을 열고 연필 아이콘을 누릅니다.
여섯 칸을 내 내용으로 바꾸고 **Commit changes**.

고칠 파일은 이 하나뿐입니다. 다른 파일은 열지 않아도 됩니다.

### 5. 확인하기
커밋하면 자동으로 다시 배포됩니다. 1~2분 뒤 내 주소를 열어 두 가지를 봅니다.

- 제대로 적어 넣으면 → 답이 나오는가
- **일부러 정보를 빼고 적으면 → 답하지 않고 되묻는가**

두 번째가 안 되면 `_config.js` 의 `멈춤` 칸을 더 구체적으로 적으세요.

---

## 그다음에 할 일

- `AGENTS.md` 를 채웁니다. 이게 이번 과제의 본체입니다.
- `docs/01_인터뷰기록.md` 에 인터뷰 내용을 **이름을 지우고** 옮깁니다.
- `docs/03_점검.md` 를 대상자에게 직접 써 보게 하고 받아 적습니다.

---

## 안 될 때

| 증상 | 확인할 것 |
|---|---|
| 답 대신 "지금은 답할 수 없습니다" | 3번 바인딩을 안 했거나, 이름이 `AI` 가 아니거나, 하루 한도 초과 |
| 화면 제목이 "준비 중" 그대로 | 배포가 아직 안 끝났습니다. 1~2분 뒤 새로고침 |
| 커밋했는데 안 바뀜 | Cloudflare **Deployments** 탭에서 실패했는지 확인 |
| 한국어가 어색함 | `_config.js` 의 `모델` 을 `"@cf/meta/llama-3.1-8b-instruct"` 로 바꿔 보세요 |
| 답이 자꾸 길고 딴소리 | `기준` 세 줄을 더 좁게. 기준이 넓으면 아무 말이나 나옵니다 |

---

## 구조

```
public/index.html        화면 (고칠 일 거의 없음)
functions/_config.js     ← 여기만 고칩니다
functions/api/ask.js     프롬프트를 만들어 AI 에 보냄
functions/api/meta.js    화면 글자를 내보냄
AGENTS.md                사람과 AI가 같이 읽는 설명서
docs/                    인터뷰 기록 · 명세서 · 점검
wrangler.toml            Cloudflare 설정
```

API 키는 어디에도 없습니다. AI 는 Cloudflare 바인딩으로 부릅니다.
