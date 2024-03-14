  #!/bin/bash
  
# 프로필 파일 경로 설정
PROFILE_PATH="/home/ubuntu/.profile"

# 프로필 파일 존재 및 읽을 수 있는지 확인
if [ -f "$PROFILE_PATH" ] && [ -r "$PROFILE_PATH" ]; then
    # 프로필 파일 로드
    source "$PROFILE_PATH"
else
    echo "Warning: Unable to load profile file at '$PROFILE_PATH'."
fi