export class Settings {
    public static HOST(): string {
        //casa
        //return 'http://localhost:8000/';

        //inei
        return 'http://lfarfan.inei.com.pe:8000/';
    }
    public static HOST_LOCAL(): string {
        return 'http://lfarfan.inei.com.pe:85/';
    }
    public static HOST_ROCIO(): string {
        return 'http://rvila.inei.com.pe:8000/';
    }
}