import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subject,Observable} from 'rxjs/';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
@Component({
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.css']
})
export class FaceDetectComponent implements OnInit {
  found:boolean;
  //imgurl:string="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Dts_news_bill_gates_wikipedia.JPG/260px-Dts_news_bill_gates_wikipedia.JPG";
  textData:string="";
  constructor(private httpClient:HttpClient){  }

  SearchDataForImg(imgUrl:string){
    const thish = new HttpHeaders({'Ocp-Apim-Subscription-Key':'c4b9067fcdfd4f7db2193582b0744ba3'});
    this.httpClient.post(`https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise`,{
      url:imgUrl
    },{headers: thish})
    .subscribe(
      (data:any[]) => {
        if(data.length) {
          this.textData = data[0].faceId;
          this.found = true;
          console.log(data[0]);
        }
      }
    )
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }
  SearchDataForImgSnap(){
    const imgdata=this.webcamImage.imageAsDataUrl;
    const imgblob=this.dataURItoBlob(imgdata);
    this.httpClient.post(`https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise`,
       imgblob
    ,{headers:new HttpHeaders().set('Ocp-Apim-Subscription-Key','c4b9067fcdfd4f7db2193582b0744ba3')
    .set('Content-Type','application/octet-stream') })
    .subscribe(
      (data:any[]) => {
        if(data.length) {
          this.textData = data[0].faceId;
          this.found = true;
          console.log(data[0]);
        }
      }
    )
  }

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.SearchDataForImgSnap();
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
