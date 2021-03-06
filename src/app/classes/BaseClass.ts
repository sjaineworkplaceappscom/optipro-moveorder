import { HttpClient } from '@angular/common/http';
export class BaseClass {
    public href: any = window.location.href;
    public adminDBName: string = "OPTIPROADMIN";
    public productCode: string = "MMO";
    public messageConfig: any = {
        closeButton: true
        // progressBar:true
    }

    //This will get the path of app
    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        return temp;
    }
    
    //Customization Client Codes
    public ellyza_london: any = "EllyzaLondon"
    public dacsa: any = "DACSA"
    public standard:any = "standard"
}