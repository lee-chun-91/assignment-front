
# 설문지 관리 시스템 

## ✏️프로젝트명 & 소개 

- **프로젝트명** : **설문지 관리 시스템**
- 프로젝트 제작기간 : 2022.10.24. (월) ~ 2022.11.04. (금)
- 서비스 소개
    - 설문지 생성 및 수정 / 배포 / 통계 / 응답 로그를 확인할 수 있는 설문 관리 시스템입니다.
- 주요 기능
    - 설문지 생성 및 수정 
    - 설문지 배포
    - 응답 통계
    - 응답 로그 
- 개발 언어 : JavaScript
- 개발 라이브러리 : Vue.js (2.7.13)
- 형상 관리 : git


## 🛠프론트엔드 기술(+version) 및 선정 이유

- **vue-chartjs (4.1.2)**
    - vue 사용자 내에서 가장 보편적으로 사용되는 차트 라이브러리 중 하나
    - 사용이 편리하며, 깔끔한 비주얼 파이차트, 컬럼차트 제공
    
- **vuedraggable (2.24.3)**
    - 관리자의 설문지 생성 및 수정 시 사용성을 고려하여 사용 결정
    - drag and drop 으로 설문 질문 순서를 쉽게 변경할 수 있음
    
- **vue-class-component (7.2.3) / vue-property-decorator (9.1.2)**
    - 타입스크립트의 타입 추론 방식이 객체 구조보다 함수 구조에서 더 잘 작동하는 점을 고려, 
    - 뷰에서 클래스 문법, 데코레이터를 사용하여 타입 추론을 용이하게 할 수 있음.

- **vuex (3.6.2) / vuex-module-decorators (1.2.0)**
    - "부모-자식-자손" 과 같이 복잡한 부모 자식관계에서 쉽게 상태관리 하기 위해 사용
    - 데이터가 필요한 컴포넌트 어디에서나 해당 값을 선언하여 사용 가능
    
- **Eslint (7.32.0)**
    - 팀 vue 컨벤션 rules 설정하여 코드 작성 핏 맞추기 위해 사용
    
  


## 📂폴더구조

1. api, store(vuex) 
  - 메인 기능별 모듈을 구분, 각 폴더에서 관리했습니다.

2. assets(scss) 
  - component의 style 을 관리하는 scss 폴더를 두어 관리했습니다.
  - scss 폴더는 vue component 폴더 구조와 1:1 매칭되도록 생성하여 관리했습니다.

3. components 
  - page 별 사용하는 자식 component 요소를 폴더별로 나누어 관리했습니다. 

4. const 
  - 상수로 사용하는 question-type 을 따로 빼어 관리했습니다.
  
5. layouts, pages, router
  - 페이지 상단 헤더 유무에 따라 layout 을 2개로 나누고 해당, layout 의 child route로 page(page-xx.vue 형식)를 배치했습니다. 

6. utils 
  - 공통으로 쓰는 함수이면서 component 가 아닌 요소들을 두어 관리했습니다.


![image](https://user-images.githubusercontent.com/113881834/199671400-91461b7b-dc61-45db-97d6-feffb7d5f924.png)

![image](https://user-images.githubusercontent.com/113881834/199671471-aa68e5be-7c62-4623-b5d4-51ae4f7701c7.png)




## 🔥트러블 슈팅


###  

- 현상
    - 
    -  
- 원인
    - 
- 해결
    - 
    
### ** **

- 현상
    - 
    -  
- 원인
    - 
- 해결
    - 
    


