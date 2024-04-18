"use client";

import { Button } from "@/components/ui/button";
import { GenerateQuestionResponse } from "@/types/problems";
import axios from "axios";
import { useEffect, useState } from "react";

const document =
  `Hacking & Private Information ProtectionHacking & Private Information Protection
사용자 계정 - Ⅰ
Last update : 2024/3/18
“해킹과개인정보보호”

2
Hacking & PIP
2
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 Windows 설정 / 제어판
 설정
 사용자 기본 설정 조정 / 운영 체제 구성 / 연결된 장치 관리
 윈도우 서버 2012와 윈도우 8에 설정을 도입하였으며, 원래는 제어판 대체용이었음
 실행 방법
 시작 → “설정” 또는 시작 + i
윈도우 기초

3
Hacking & PIP
3
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

4
Hacking & PIP
4
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 제어판
 기본적인 시스템 설정과 상태 확인 및 변경
 새 하드웨어 추가, 프로그램 추가 및 제거(프로그램 및 기능) / 사용자 계정 관리 / 접근성 옵션 변경 등
 실행 방법
 시작 → “제어판” 또는 시작 + R → “control”

5
Hacking & PIP
5
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

6
Hacking & PIP
6
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

7
Hacking & PIP
7
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 설정 / 제어판에서 주로 사용하는 기능
 Windows Defender 방화벽 : 방화벽 설정 확인 및 변경
 관리 도구 : 레지스트리 편집기, 서비스, 컴퓨터 관리 등 여러 관리 프로그램에 접근
 네트워크 및 공유 센터 : 네트워크 설정을 확인하고 변경
 백업 및 복원(Windows 7) : 데이터 백업 및 복원
 복구 : 백업 드라이브 만들기 및 복구, 복원
 사용자 계정 : 사용자 계정 추가, 변경, 삭제 등 계정 관리
 시스템 : 시스템 정보 확인 및 변경
 파일 히스토리(Windows 10) : 데이터 백업 및 복원
 프로그램 및 기능 : 설치된 프로그램 확인 및 변경, 삭제

8
Hacking & PIP
8
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 Microsoft Management Console
 개요
 시스템 관리 및 구성 (시스템 관리자와 고급 사용자 용)
 다양한 관리 프로그램을 실행하기 위한 컨테이너(틀, 그릇) 역할
 실행 방법
 시작 + R → “MMC”

9
Hacking & PIP
9
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 “파일” → “스냅인 추가/제거”를 통해 다양한 관리 기능을 추가/제거할 수 있다.

10
Hacking & PIP
10
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 스냅인은 대부분 독립적으로 실행할 수 있다.
파일이름 기능
compmgmt.msc
컴퓨터 관리
diskmgmt.msc
디스크 관리
eventvwr.msc
이벤트 뷰어
perfmon.msc
성능 모니터링
secpol.msc
로컬 보안정책 설정
devmgmt.msc
장치 관리
dfrg.msc
디스크 조각모음
fsmgmt.msc
공유 폴더 관리
lusrmgr.msc
로컬 사용자 관리
rsop.msc
정책 결과 집합
services.msc
서비스 관리
gpedit.msc
그룹 정책 편집기

11
Hacking & PIP
11
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 RegEdit
 개요
 윈도우 운영 체제의 설정과 선택 항목을 담고 있는 데이터베이스
 모든 하드웨어, (비)운영 체제 소프트웨어 등에 대한 정보/설정 보관
 실행 방법
 시작 + R → “REGEDIT”

12
Hacking & PIP
12
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 CMD / PowerShell
 CMD 개요
 윈도우 NT 5.0 이상 시스템의 CLI(Command Line Interface: 명령어 인터페이스)
 MS-DOS와 윈도우 9x 시스템에서 쓰이던 셸의 아날로그 형태
 수많은 내부 명령을 GUI가 아닌 텍스트 입력 형태로 실행할 수 있음
 실행 방법
 시작 + R → “CMD”

13
Hacking & PIP
13
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 PowerShell 개요
 CMD보다 확장된 CLI
 윈도우를 위해 개발하였으나, 다양한 운영체제에서 사용할 수 있도록 공개
 실행 방법
 시작 + R → “POWERSHELL” 또는 시작에서 우클릭 → Windows PowerShell

14
Hacking & PIP
14
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 네트워크/통신 기초
 개요
 통신(Communication)은 컴퓨터를 이용하여 데이터(정보)를 송/수신하는 것이며, 데이터 송/수
신을 위해서는 유선/무선의 경로(선로)가 필요한데, 이러한 경로(선로)의 집합을 네트워크
(Network)라고 한다.
 가장 흔하게 이용하는 네트워크는 “인터넷(Internet)”이다.
네트워크/통신 기초

15
Hacking & PIP
15
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 인터넷 연결을 위한 기본 구조
랜선(UTP)
공유기(게이트웨이)
무선(와이파이)
INTERNET

16
Hacking & PIP
16
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
도메인 이름 이름
 IP 주소
 전화를 이용할 때 전화기를 구별할 수 있는 전화번호가 필요하듯
인터넷을 이용할 때도 연결된 컴퓨터를 구별하기 위한 “고유번호”가 필요하다.
010-5093-9000142.251.42.131
이윤호
www.google.co.kr
IP 주소 전화번호

17
Hacking & PIP
17
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
랜선(UTP)
공유기(게이트웨이)
무선(와이파이)
INTERNET
다른 장치와 연결되는 곳을 인터페이스라고 하며,
인터페이스마다 고유한 IP 주소가 할당되어야 한다.
내 IP 주소
게이트웨이
IP 주소

18
Hacking & PIP
18
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 내 컴퓨터의 IP 주소를 확인하는 방법
 CMD 또는 PowerShell을 실행한 후 ipconfig를 실행
PS C:\Users\leeyunho> ipconfig
Windows IP 구성
이더넷 어댑터 이더넷:
연결별 DNS 접미사. . . . :
링크-로컬 IPv6 주소 . . . . : fe80::2cb6:6317:af06:6fc9%18
IPv4 주소 . . . . . . . . . : 192.168.219.108
서브넷 마스크 . . . . . . . : 255.255.255.0
기본 게이트웨이 . . . . . . : 192.168.219.1
무선 LAN 어댑터 Wi-Fi:
미디어 상태 . . . . . . . . : 미디어 연결 끊김
연결별 DNS 접미사. . . . :
무선 LAN 어댑터 로컬 영역 연결* 1:
...
내 IP 주소
게이트웨이
IP 주소

19
Hacking & PIP
19
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

20
Hacking & PIP
20
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 개요
 PC의 발전
 과거 : PC는 개인 단독으로 사용하는 것
 다중 사용자에 대한 요구가 없음
→ 계정 서비스가 필요없음
 현재 : 서버 기능 + 다수 사용자가 함께 사용
 ① 설정 변경, 파일 관리, 프로그램 설치 등과 관련하여 계정 서비스가 필요
 ② 개인용 PC를 넘어 네트워크 서버 역할도 수행
→ 웹서버, FTP 서버 등
 Unix, Linux의 경우
 처음부터 다중 사용자를 위한 운영체제로 시작
 사용자 계정 및 권한에 관한 서비스가 명확함
사용자 계정

21
Hacking & PIP
21
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 계정의 필요성
 ① 독립적인 파일/폴더 관리
 각각의 사용자는 다른 사용자의 파일/폴더에 접근할 수 없다.
 바탕화면 등 개인의 설정을 다른 사용자가 바꿀 수 없다.
 ② 프로그램 설치 관리
 관리자는 사용자의 프로그램 설치를 제한할 수 있다.
 ③ 컴퓨터 설정 관리
 하드웨어 드라이버 설치, 변경 등은 관리자만 실행할 수 있다.
 특정 사용자의 하드웨어 사용을 제한할 수 있다.
→ 하드디스크 사용 용량 제한(Quota) 등
 계정과 그룹
 계정이 많을 경우 개별 계정의 권한을 설정하는 것보다
계정 그룹을 이용하는 것이 편리하다.

22
Hacking & PIP
22
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 Windows 계정 유형
 ① 컴퓨터 관리자
 ① 컴퓨터의 모든 자원을 사용할 수 있다.
② 다른 계정을 관리할 수 있다.
 특징
 ① 다수의 사용자 계정을 관리자 유형으로 지정할 수 있다.
② 최소한 1 명의 관리자가 있어야 한다.
※ 관리자가 1명일 경우 ‘제한된 계정’으로 변경할 수 없다.

23
Hacking & PIP
23
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 컴퓨터 관리자 유형의 역할
 ① 사용자 계정의 생성과 삭제
 ② 사용자의 계정 이름, 그림, 암호, 유형 변경
 ③ 소프트웨어와 하드웨어의 설치 및 제거
 ④ 시스템 설정 변경
 ⑤ 응용 프로그램의 사용
 ⑥ 폴더 및 파일의 생성, 수정, 속성 변경
파일에 대한 접근 권한을 바꾸는 경우
(Authenticated Users, Users 삭제)

24
Hacking & PIP
24
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
사용자 Davichi가 소유한 파일의 권한을 바꾸는 경우

25
Hacking & PIP
25
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 관리자가 프로그램을 설치하는 경우
 ① 관리자를 위한 프로그램으로 설치
② 모든 사용자를 위한 프로그램으로 설치
를 선택할 수 있다.
현재 사용자
모든 사용자

26
Hacking & PIP
26
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ② 제한된 계정
 컴퓨터 관리자를 제외한 다른 사용자 유형 (Windows 7/10의 ‘표준 사용자’)
 제한된 계정(표준 사용자)의 역할
 ① 계정 암호 생성, 변경 및 삭제
 ② 계정 그림 변경
 ③ 응용 프로그램 사용
 ④ 바탕 화면, 즐겨찾기 등 개인적인 환경 설정 및 관리
 ⑤ 폴더 및 파일의 생성 및 수정

27
Hacking & PIP
27
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ③ Guest 계정
 정식 사용자가 아닌 임시 사용자를 위한 계정
 암호 로그인 기능을 제공하지 않음
 메일 확인, 웹 서핑, 간단한 문서 작성, 인쇄 등의 작업을 실행
 ‘보안’을 위해 기본적으로 사용 불가로 설정
Guest 계정의 기본 설정은 ‘사용 안 함’임

28
Hacking & PIP
28
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 Windows 계정 그룹
 개요
 필요성 : 계정이 많아질 경우 개별 계정의 권한 설정이 어려움
→ 그룹 설정을 이용하면 편리
 Windows XP, 7은 다수의 기본 계정 그룹을 제공
 기본 그룹은 ‘Administrators’, ‘Power Users’, ‘Users’ 임
한 계정은 여러 그룹에 속할 수 있다없다 / 있다

29
Hacking & PIP
29
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
Windows XP의 기본 계정 그룹

30
Hacking & PIP
30
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
Windows 7의 기본 계정 그룹
※ Home 버전은 이런 GUI 환경을 제공하지 않음

31
Hacking & PIP
31
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ① Administrators 그룹
 컴퓨터 관리 작업 실행 (전체 시스템에 대한 완전한 제어)
 신뢰할 수 있는 사용자만 이 그룹에 속해야 함
→ ‘Administrator’ 계정은 기본적으로 이 그룹에 속함
 ②Power Users 그룹
 권한은 Users < Power Users < Administrators
 ‘Administrators’ 그룹의 작업을 제외한 나머지 모든 시스템 관리 작업 실행
 더 이상 제공되지 않음
 ③ Users 그룹
 가장 낮은 권한을 가지며, 가장 안전한 그룹임
 운영체제의 파일이나 프로그램을 수정할 수 없음
‘컴퓨터 관리자’ 유형은 Administrators, Power Users 그룹이며,
‘제한된 계정’ 유형은 Users 그룹이다.

32
Hacking & PIP
32
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 계정 추가시 암호 설정 방법
 ① 계정 사용자는 기본 암호를 관리자에게 알려준다.
 ② 관리자는 해당 암호로 사용자 계정을 만든다.
 ③ 사용자는 로그온 후 제어판을 이용하여 자신의 계정 암호를 바꾼다.

33
Hacking & PIP
33
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 계정 만들기(Windows 10 Home)
 계정 생성 절차
 Home 버전은 계정 관리, 그룹 관리에 제약이 많음 (시작 → 설정)

34
Hacking & PIP
34
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

35
Hacking & PIP
35
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

36
Hacking & PIP
36
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

37
Hacking & PIP
37
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18

38
Hacking & PIP
38
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
계정 유형만 변경할 수 있고 다른 관리 기능은 없다!

39
Hacking & PIP
39
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 net 명령 활용
 그래픽 환경으로 관리할 수 있는 기능은 제한되어 있지만,
관리자 권한으로 명령 프롬프트(cmd)를 이용하면 어느정도 관리 기능을 실행할 수 있다.
 net 명령의 종류

40
Hacking & PIP
40
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
오른쪽 버튼 클릭 후
＇관리자 권한으로 실행'
또는, 여기를 클릭해서 실행

41
Hacking & PIP
41
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 패스워드 변경 : 관리자 권한으로 실행된 '명령 프롬프트’에서 net 명령을 통해 사용자 패스워드
를 변경할 수 있다.
net user [username] [new_password]
net user davichi 9999
사용방법
davichi 사용자의 패스워드를 9999로 변경

42
Hacking & PIP
42
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 그룹 만들기
 Windows XP Home, 7 Home, 10 Home 버전은 그룹 관리를 위한 GUI를 제공하지 않는다.
 ① CMD 창 실행
 ‘시작’ → CMD 입력 및 관리자 권한으로 실행

43
Hacking & PIP
43
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ② 그룹 만들기
 Singer 그룹을 만들어보자.
net localgroup GroupName /add
∙ GroupName : 생성할 그룹의 이름

44
Hacking & PIP
44
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ③ 그룹에 사용자 추가
 이미 만든 Davichi 계정을 Singer 그룹에 추가한다.
 여러 사용자를 한꺼번에 추가할 수도 있다.
net localgroup GroupName [UserName ...] /add
∙ GroupName : 그룹의 이름
∙ UserName : 그룹에 추가할 사용자 계정 이름

45
Hacking & PIP
45
Hacking & PIP
Prepared by Yunho Lee, © 2024-03-18
 ④ 그룹에서 사용자 제거 및 그룹 삭제
 그룹에서 사용자를 제거하거나, 그룹을 삭제할 때는 /delete 명령을 이용한다.
 그룹을 삭제할 때는 그룹 이름만 지정한다.
Singer 그룹에서 사용자 Davichi와 leeyunho를 제거한다.
Singer 그룹을 삭제한다.
`.replaceAll(`\\`, `\\\\`);

export default function TestPage() {
  const [generateQuestionResponse, setGenerateQuestionResponse] =
    useState<GenerateQuestionResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [step, setStep] = useState<number>(1);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post<GenerateQuestionResponse>(
        "/api/generateProblemsGoogle",
        {
          source: document,
        },
      );
      const data = res.data;

      if (data === null) {
        alert("문제를 생성하는데 실패했습니다..");
      } else {
        setGenerateQuestionResponse(data);
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    } finally {
      setIsLoading(false);
      setStep(1);
    }
  };

  useEffect(() => {
    console.log("generateQuestionResponse :", {
      ...generateQuestionResponse,
      questions: generateQuestionResponse?.questions?.toSorted((a, b) =>
        a.question < b.question ? -1 : 1,
      ),
    });
  }, [generateQuestionResponse]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Button className="w-[10rem]" onClick={handleClick}>
        Click Me
      </Button>
      {isLoading && <div>로딩중... {`단계 ${step}`}</div>}
      <div>{generateQuestionResponse?.questions?.toString()}</div>
    </div>
  );
}
