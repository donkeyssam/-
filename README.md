# 받침 소리를 구하자! (특수교육 보조공학 웹 보드게임)

특수교육 대상 학생 및 초등 1~2학년을 위한 조음 위치별 받침 학습 인터랙티브 보드게임입니다.

---

## 🚀 넷리파이(Netlify) & 깃허브(GitHub) 자동 배포 안내

본 저장소에는 넷리파이 자동 빌드 및 배포를 위한 설정 파일(`netlify.toml`, `.nvmrc`, `_redirects`)이 사전에 완벽히 구성되어 있습니다.

### 1. 깃허브와 넷리파이 연결 방법 (GitHub 연동)
1. [Netlify 대시보드](https://app.netlify.com/)에 로그인합니다.
2. **"Add new site"** ➡️ **"Import an existing project"**를 클릭합니다.
3. **"GitHub"**를 선택하고 권한을 승인한 뒤, 이 저장소를 선택합니다.
4. **빌드 설정(Build settings)**:
   - `netlify.toml` 파일에 의해 모든 설정이 자동 입력되므로 별도의 설정 변경 없이 바로 **"Deploy"**를 누르시면 됩니다.
   - (참고) 자동 감지 항목:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node.js version**: `20`

### 2. 혹시 깃허브 연동 권한 오류가 계속될 때 (초간단 대안: 드래그 앤 드롭)
만약 깃허브 계정 권한 문제로 연동이 지연되는 경우:
1. 내 컴퓨터에서 터미널을 열고 `npm run build`를 실행합니다.
2. 생성된 `dist` 폴더를 [Netlify Drop](https://app.netlify.com/drop) 화면에 마우스로 끌어다 놓으면(Drag & Drop) 3초 만에 즉시 배포 사이트 URL이 생성됩니다.
3. 또는 본 앱에서 제공하는 **`받침게임.html 다운로드`** 기능을 통해 인터넷 없이 단독 파일로 바로 수업에 활용하실 수도 있습니다.
