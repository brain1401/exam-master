# Exam Master 📚

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

AI 기반 맞춤형 학습 플랫폼 | [Demo](https://exammaster.co.kr) | [Documentation](./docs)

</div>

## 📋 목차
- [소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [아키텍처](#-아키텍처)
- [설치 및 실행](#-설치-및-실행)
- [기여 방법](#-기여-방법)
- [라이센스](#-라이센스)

## 🌟 프로젝트 소개

Exam Master는 AI 기술을 활용하여 맞춤형 학습 경험을 제공하는 현대적인 교육 플랫폼입니다. OCR 기술과 AI를 결합하여 자동 문제 생성이 가능하며, 사용자 친화적인 인터페이스를 통해 효율적인 학습 관리를 지원합니다.

### 핵심 가치
- **맞춤형 학습**: 개인의 학습 스타일과 진도에 맞는 문제 제공
- **효율성**: AI 기반 자동 문제 생성으로 학습 자료 제작 시간 단축
- **접근성**: 직관적인 UI/UX로 누구나 쉽게 사용 가능
- **공유와 협력**: 문제집 공유 기능으로 학습 자원 공유 촉진

## 🎯 주요 기능

### AI 기반 문제 생성
- OCR 기술을 활용한 교재 스캔 및 자동 문제 변환
- 다양한 유형(객관식/주관식)의 문제 자동 생성
- AI 기반 문제 품질 검증 시스템

### 문제 관리 시스템
- 드래그 앤 드롭으로 간편한 문제 순서 변경
- 실시간 미리보기로 즉각적인 피드백
- 이미지 첨부 및 수식 입력 지원
- 문제 태그 시스템으로 효율적인 분류

### 학습 분석 대시보드
- 개인별 학습 진도 및 성취도 시각화
- 취약 분야 자동 분석
- 학습 패턴 인사이트 제공

## 🚀 기술 스택

### Frontend
- **Next.js 15**
  - App Router 기반 서버 컴포넌트 아키텍처
  - 동적 라우팅 및 정적 생성 최적화
  - Streaming SSR로 초기 로딩 성능 개선
- **TypeScript**
  - 엄격한 타입 시스템으로 런타임 에러 방지
  - 코드 품질 및 유지보수성 향상
- **Tailwind CSS**
  - JIT 컴파일로 번들 크기 최적화
  - 반응형 디자인 시스템 구축

### 상태 관리
- **Jotai**
  - App Router 환경 최적화된 상태 관리
  - 서버 컴포넌트 Hydration 지원
- **React Query**
  - 캐싱 및 동기화 자동화
  - 무한 스크롤 구현

### 인프라스트럭처
- **AWS 서비스**
  - RDS (PostgreSQL): 확장 가능한 관계형 데이터베이스
  - S3: 이미지 저장 및 CDN 배포
  - CloudFront: 글로벌 콘텐츠 전송
- **보안**
  - NextAuth: OAuth 및 JWT 기반 인증
  - HTTPS 적용 및 보안 헤더 구성

## 🏗 아키텍처

## 🔗 링크

- [서비스 바로가기](https://exammaster.co.kr)
- [기여 가이드](CONTRIBUTING.md)
- [라이센스](LICENSE)

## 📞 문의 및 기여

버그 리포트, 기능 제안 등은 GitHub Issue를 통해 알려주세요. 프로젝트 기여는 CONTRIBUTING.md를 참고해주세요.

---

© 2024 Aiden. All Rights Reserved.
