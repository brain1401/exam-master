export default function LoginRequired() {
  return (
    <>
      <h1 className="mt-10 p-5 text-center text-2xl">{`서비스를 이용하려면 로그인이 필요합니다!`}</h1>
      <p className="whitespace-pre-line p-5 text-center">{`현재는 구글 로그인만 지원합니다.\n추후에 다양한 로그인 방식을 추가할 예정입니다.\n또한 현재 개발 중인 앱으로 디자인 등을 개선 중에 있습니다.`}</p>

      <p className="p-5 text-center whitespace-pre-line font-bold">{`또한 이 앱을 사용함으로써 Exammaster 웹앱을 이용하는 중 발생할 수 있는 예기치 않는 버그나 오류 등으로 인해\n 받을 수 있는 피해는 개발자가 책임지지 않는다는 것을 동의하는 것으로 간주합니다.`}</p>
    </>
  );
}
