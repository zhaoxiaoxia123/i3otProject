import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Observable";
/**
 * Created by LJ on 2017/8/1.
 */
/**
 * 同步验证
 * @param contorl
 * @returns {{mobileValid: boolean}}
 */
export function mobileValidator(contorl : FormControl) : any {
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})/;
    let valid = myreg.test(contorl.value);
    // console.log('phone:'+valid);
    return valid ? null : {mobileValid:true};
}
/**
 * 异步验证
 * @param contorl
 */
export function mobileAsyncValidator(contorl : FormControl) : any {
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})/;
    let valid = myreg.test(contorl.value);
    // console.log('phone:'+valid);
    //delay(5000)  模拟服务器，请求延迟5秒
    return Observable.of(valid ? null : {mobileValid:true}).delay(2000);
}
export function passwordValidator(group : FormGroup) : any {
    let password : FormControl = group.get('password') as FormControl;
    let pconfirm : FormControl = group.get('pconfirm') as FormControl;
    let valid : boolean = (password.value === pconfirm.value);
    return valid ? null : {valid:{desc:'密码和确认密码不匹配'}};
}


