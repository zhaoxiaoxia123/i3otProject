import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FadeInTop} from "../../animations/fade-in-top.decorator";
import {GlobalService} from "../../../core/global.service";
import { FileUploader} from "ng2-file-upload";
import {isUndefined} from "util";
import {read} from "fs";

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

    // 初始化上次图片变量
    public uploader:FileUploader = new FileUploader({
        url: this.globalService.getDomain() + "/api/v1/uploadFile",
        method: "POST",
        removeAfterUpload:true,
        itemAlias: "uploadedfile",

    });
    selectedImageUrl : any[] = [];
    selectedImgLength = 0;
    constructor(
      private globalService:GlobalService
    ) { }

    ngOnInit() { }


    // C: 定义事件，选择文件
    selectedFileOnChanged(index) {
        let $this = this;
        let selectedArr = this.selectedImageUrl;
        this.uploader.queue.forEach((q,i)=>{
            if(this.selectedImgLength == 0 || i>this.selectedImgLength - 1){
                let reader = new FileReader();
                reader.readAsDataURL(q.some);
                reader.onload = function(e){
                    let imgs = {
                        url:this.result,
                        uploadID:i,
                        pIndex:index
                    };
                    if(selectedArr.length > 0){
                        let isSame = false;
                        selectedArr.forEach((img,j)=>{
                            if(img.url == this.result){
                                isSame = true;
                            }
                        });
                        if(!isSame){
                            selectedArr.push(imgs);
                        }else{
                            $this.uploader.queue[i].remove();
                            $this.selectedImgLength = $this.uploader.queue.length;
                        }
                    }else{
                        selectedArr.push(imgs);
                    }
                }
            }
        });
        this.selectedImgLength = this.uploader.queue.length;

        this.imgList = selectedArr;
        console.log('selectedArr:----');
        console.log(this.selectedImgLength);
    }
    // // D: 定义事件，上传文件  单个文件
    // uploadFile() {
    //     // 上传
    //     let that = this;
    //     if(!isUndefined(that.uploader.queue[0])) {
    //         that.uploader.queue[0].onSuccess = function (response, status, headers) {
    //             let tempRes = JSON.parse(response);
    //             // 上传文件成功
    //             if (status == 200) {
    //                 // 上传文件后获取服务器返回的数据
    //                 alert('上传成功，如需上传多张请继续上传！');
    //                 that.path = tempRes['result'];
    //                 that.imgList.push(that.path);
    //                 that.imgCount = that.imgList.length;
    //                 console.log(that.imgList);
    //             } else {
    //                 // 上传文件后获取服务器返回的数据错误
    //                 alert(tempRes['msg']);
    //             }
    //         };
    //         this.uploader.queue[0].upload(); // 开始上传
    //     }else{
    //         alert('还没有选择要上传的图片！');
    //     }
    // }

    uploadFile() {
        let $this = this;
        this.selectedImageUrl.forEach((img, i) => {
            //在上传的this.uploader队列中标记图片所属；根据项目需求
            //如果同时对多个商品进行评价并上传图片，所有商品选择的图片是存储在同一个数组中，
            //所以上传之前需要标识属于哪个商品，上传成功之后返回的数据同样会带有标识
            this.uploader.queue[i]['pIndex'] = img.pIndex;
        });


        this.uploader.uploadAll(); // 开始上传
        this.uploader.onSuccessItem = (item, res, status, headers) => {
            let tempRes = JSON.parse(item);
            // 上传文件成功
            if (status == 200) {
                // 上传文件后获取服务器返回的数据
                this.path = tempRes['result'];
                this.imgList.push(this.path);
                this.imgCount = this.imgList.length;
                console.log(this.imgList);
            } else {
                // 上传文件后获取服务器返回的数据错误
                alert(tempRes['msg']);
            }
        };
        this.uploader.onCompleteAll = function () {
            //uploader: FileUploader服务是单张上传图片，
            //onCompleteAll可以检测到图片全部上传完成
            //全部图片上传结束
            //一般上传图片和上传其他评价的信息接口都是分开的，可以在此方法中构建需要上传的数据模型并调取相关接口
            //over
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
