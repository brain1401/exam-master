import {
  MdInfo,
  MdWarning,
  MdCopyright,
  MdBugReport,
  MdCoffee,
} from "react-icons/md";
import AnnouncementSection from "./AnnouncementSection";
import CopyableText from "./CopyableText";

export default function Announcements() {
  return (
    <div className="space-y-6 rounded-lg bg-gray-50 p-6 shadow-md dark:bg-gray-800">
      <AnnouncementSection
        icon={<MdInfo className="h-6 w-6 text-blue-500" />}
        title="서비스 안내"
        content={`현재는 구글 로그인만 지원합니다.\n추후에 다양한 로그인 방식을 추가할 예정입니다.\n또한 현재 개발 중인 앱으로 디자인 등을 개선 중에 있습니다.`}
      />

      <AnnouncementSection
        icon={<MdWarning className="h-6 w-6 text-yellow-500" />}
        title="면책 조항"
        content={`본 서비스는 개인이 운영하는 서비스로 이용하시는 중 발생할 수 있는 예기치 않은 버그, 오류, 또는 데이터 손실로 인한 불편이나 손해에 대해 개발자가 법적 책임을 지기 어려운 점을 양해 부탁드립니다. 본 앱을 이용하시는 것은 이러한 조건에 동의하시는 것으로 간주됨을 알려드립니다.`}
        className="font-semibold"
      />

      <AnnouncementSection
        icon={<MdCopyright className="h-6 w-6 text-green-500" />}
        title="저작권 안내"
        content={`저작권 관련 문제가 있는 공개 문제집을 발견하셨거나, 본인의 저작물이 무단으로 사용된 경우 즉시 삭제 조치하겠습니다.\n삭제 요청 및 기타 저작권 관련 문의는 아래 이메일로 연락 주시기 바랍니다.`}
      />

      <AnnouncementSection
        icon={<MdBugReport className="h-6 w-6 text-red-500" />}
        title="버그 제보"
        content={`서비스 이용 중 버그를 발견하셨다면, 아래 이메일로 상세한 내용과 함께 제보해 주시기 바랍니다. 여러분의 제보는 서비스 개선에 큰 도움이 됩니다.`}
      />

      <AnnouncementSection
        icon={<MdCoffee className="text-brown-500 h-6 w-6" />}
        title="후원 안내"
        content={`AI 문제 생성 기능 추가 등으로 인한 비용 문제와 홈페이지의 안정적인 운영을 위해 여러분의 후원이 큰 힘이 됩니다. 자취하는 대학생의 열정 프로젝트를 응원해 주시는 의미로, 커피 한 잔 사주신다는 생각으로 1000원이라도 후원해 주시면 정말 감사하겠습니다.ㅠㅠ 작은 금액이라도 큰 도움이 됩니다.`}
      />

      <p className="text-md mt-4 text-center">
        후원 계좌: 토스뱅크 <CopyableText text="1000-2767-1869" /> (예금주:
        ㅎㅌㄱ)
      </p>

      <p className="text-md mt-4 text-center">
        문의사항, 저작권 관련 요청 또는 버그 제보는
        <CopyableText text="brain1401@gmail.com" />
        으로 연락해주세요.
      </p>
    </div>
  );
}
