export class Settings {
    public static HOST(): string {
        //casa
        //return 'http://localhost:8000/';

        //inei
        return 'http://172.18.1.40:8080/';
    }
    public static HOST_LOCAL(): string {
        //return 'http://localhost:85/';
        //return 'http://lfarfan.inei.com.pe:85/';
        return 'http://172.18.1.40:8080/';
    }
    public static HOST_ROCIO(): string {
        return 'http://rvila.inei.com.pe:8000/';
    }
}