import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {GlobalService} from "../../../core/global.service";
import { FileUploader} from "ng2-file-upload";
import {isUndefined} from "util";

@FadeInTop()
@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
})
export class SelectFileComponent implements OnInit {
    /**
     * 图片
     */
    imgCount : number = 0;
    path:string = '';
    url : string = this.globalService.getDomain();

    @Input() select_type ;
    @Input() imgList : Array<any> = [];

    @Output() private select_types = new EventEmitter();
    @Output() private imgLists = new EventEmitter();
    rollback_url : string = '';

    constructor(
      private globalService:GlobalService
    ) { }

    ngOnInit() { }

    // 初始化上次图片变量
    public uploader:FileUploader = new FileUploader({
        url: this.globalService.getDomain() + "/api/v1/uploadFile",
        method: "POST",
        removeAfterUpload:true,
        itemAlias: "uploadedfile",

    });

    // D: 定义事件，上传文件
    uploadFile() {
        // 上传
        let that = this;
        if(!isUndefined(that.uploader.queue[0])) {
            that.uploader.queue[0].onSuccess = function (response, status, headers) {
                let tempRes = JSON.parse(response);
                // 上传文件成功
                if (status == 200) {
                    // 上传文件后获取服务器返回的数据
                    alert('上传成功，如需上传多张请继续上传！');
                    that.path = tempRes['result'];
                    that.imgList.push(that.path);
                    that.imgCount = that.imgList.length;
                    console.log(that.imgList);
                } else {
                    // 上传文件后获取服务器返回的数据错误
                    alert(tempRes['msg']);
                }
            };
            this.uploader.queue[0].upload(); // 开始上传
        }else{
            alert('还没有选择要上传的图片！');
        }
    }

    /**
     * remove img
     * @param ind
     */
    removeImg(ind:number){
        this.imgList.splice(ind,1);
        this.imgCount = this.imgList.length;
    }

    public hideModal(): void {
        this.select_type = '';
        this.select_types.emit('');
        this.imgLists.emit(JSON.stringify(this.imgList));
    }

}
