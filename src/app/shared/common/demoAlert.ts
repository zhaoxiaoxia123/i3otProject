
export function demoAlert(role:number) : boolean {
    if(role == 0){
        alert('演示账号，不能做此操作！');
        return true;
    }
    return false;
}
