export class BaseClass {
    public href: any = window.location.href;
    public adminDBName: string = "OPTIPROADMIN";
    public messageConfig : any = {
        closeButton: true
       // progressBar:true
      }

    public get_current_url() {
    let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
    if (temp.lastIndexOf('#') != '-1') {
        temp = temp.substring(0, temp.lastIndexOf('#'));
    }
    return temp;
    }
}