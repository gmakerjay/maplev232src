


/*

	* 단문엔피시 자동제작 스크립트를 통해 만들어진 스크립트 입니다.

	* (Guardian Project Development Source Script)

	투르 에 의해 만들어 졌습니다.

	엔피시아이디 : 1013203

	엔피시 이름 : 이베흐

	엔피시가 있는 맵 : 광장 : 아이테르 (100000000)

	엔피시 설명 : 블랙윙 간부


*/

var status = -1;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        status --;
    }
    if (mode == 1) {
        status++;
    }

    if (status == 0) {
        cm.sendOk("n0 나는 저주를 받아 전설의검에 봉인당하였다.. n1 아이테르 에 제일 강한 용사만의 이 저주를 풀어줄수있다고 하던데... ");
        cm.dispose();
        return;
    }
}
