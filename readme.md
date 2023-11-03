# 프로젝트 개요

* 본 프로젝트는 대용량 트래픽 및 데이터를 안정적으로 다루는 경험을 다뤄보기 위해서 작성된 프로젝트입니다. 
* 제가 다루고 싶은 내용은 다음과 같습니다.
  * 대용량의 트래픽을 발생한다는 가정하에 Rabbitmq 에 대량의 로그 데이터가 발생 시 안정적으로 운영하는 방법에 대한 고민
  * 수많은 데이터를 저장할 떄 안정적으로 저장하는 방법에 대한 고민
  * 수많은 데이터에 대한 쿼리를 보낼 떄 빠른 속도의 쿼리를 작성하는 방법
* 주의: 본 프로젝트는 대용량 트래픽 및 데이터를 경험하지 못한 작성자의 상상력의 바탕으로 구성되어있는 것으로 실제 서비스 기업에서 어떻게 안정적으로 사용하는지 모릅니다...

# 시나리오

* 본 프로젝트에서는 아래와 같은 시나리오를 가지고 있습니다. 

<center>
100명의 사용자가 쇼핑몰에서 구매 또는 페이지 이동을 하는 시나리오 입니다.

사용자의 모든 행위를 관찰하기 위해서 사용자가 접속한 페이지, 행위, 이름, 시간을 받아서 저장합니다.
</center>

* 위와 같이 시나리오를 작성한 이유는 나중에 쇼핑몰 회사에서 위 데이터를 기반으로 사용자 선호도 추출 및 행위 분석을 할 수 있지 않을까 해서 작성했다. 
  * 정말 테스트를 위한 무의미한 데이터를 가지고 하고싶지 않았다. 


# 트러블 슈팅 정리

* [버퍼가 꽉차는 에러](https://alwns28.tistory.com/3)
* [JavaScript heap out of memory 에러](https://alwns28.tistory.com/4)
* [MaxListenersExceededWarning](https://alwns28.tistory.com/5)
