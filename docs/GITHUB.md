# 저장소 운영 안내

- 저장소: https://github.com/naraspc/work-first-step
- 서비스: https://naraspc.github.io/work-first-step/
- 페이지 소스: `dist/index.html`
- 검사: `node --test tests/app.test.cjs`

## 최초 활성화

1. [Pages 설정](https://github.com/naraspc/work-first-step/settings/pages)에서 Build and deployment → Source를 GitHub Actions로 선택합니다.
2. [배포 워크플로](https://github.com/naraspc/work-first-step/actions/workflows/pages.yml)에서 Run workflow → main → Run workflow를 실행합니다.
3. test와 deploy 작업의 성공을 확인하고 서비스 주소를 엽니다. 설정 전에는 새 주소가 활성화되지 않을 수 있습니다.

기존 사이트에 작성한 내용은 기존 주소에서 이어쓰기 파일(JSON)로 내려받아 새 사이트에 불러옵니다.

## 변경 절차

1. `dist/index.html`의 질문·예시·기능을 수정합니다.
2. 질문을 바꿨다면 6개 직종의 예시 제목과 순서도 맞춥니다.
3. 검사 명령을 실행하고 실제 브라우저에서 입력·저장·복원·모바일 화면을 확인합니다.
4. 변경 내용을 `main`에 커밋합니다. GitHub Pages 활성화 후에는 검사 성공 시 자동 배포됩니다.

## 다른 호스팅으로 옮기기

`dist/` 전체를 정적 호스팅에 올리면 됩니다. 별도 빌드나 서버 API는 필요하지 않습니다. 사이트 주소가 바뀌면 이전 주소의 브라우저 임시저장에 접근할 수 없으므로 이전 사이트에서 JSON 백업을 내려받아 새 사이트에 불러옵니다.

## 소스 공개 범위

사용자가 작성한 업무 내용과 백업 JSON은 저장소에 포함하지 않습니다. 무료 서비스 제공과 소스 재사용 라이선스는 별개입니다. 라이선스는 소유자가 선택하기 전까지 별도로 부여하지 않습니다.
