# 배포 서버 정보

## 프로젝트
- **프로젝트명**: jvibeschool_org
- **서비스 URL**: https://jvibeschool.org/VIBETERM/

## 서버
- **IP**: 15.164.161.165
- **SSH 사용자**: bitnami
- **SSH 키**: ~/.ssh/jvibeschool_org.pem
- **웹 루트**: /opt/bitnami/apache/htdocs/

## 데이터베이스
- **DB명**: VIBETERM
- **DB 사용자**: root
- **DB 비밀번호**: XvHxGox84PU/

## 배포 명령어
```bash
# 단일 파일 배포
scp -i ~/.ssh/jvibeschool_org.pem server/파일명 bitnami@15.164.161.165:/opt/bitnami/apache/htdocs/VIBETERM/

# 전체 배포
scp -i ~/.ssh/jvibeschool_org.pem server/*.php server/*.css server/*.js bitnami@15.164.161.165:/opt/bitnami/apache/htdocs/VIBETERM/

# API 배포
scp -i ~/.ssh/jvibeschool_org.pem server/api/*.php bitnami@15.164.161.165:/opt/bitnami/apache/htdocs/VIBETERM/api/

# PHP 캐시 초기화
ssh -i ~/.ssh/jvibeschool_org.pem bitnami@15.164.161.165 "sudo /opt/bitnami/ctlscript.sh restart php-fpm"
```

## SSH 접속
```bash
ssh -i ~/.ssh/jvibeschool_org.pem bitnami@15.164.161.165
```
