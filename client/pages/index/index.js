var plugin = requirePlugin("HelloWidget");

Page({
  data:{
    sceneCardList:[],
    nowCardIndex:0,
    nowCardItem:undefined,
  },
  async onLoad(){
    // my.tb.getWidgetInfo({
    //    success:async (data)=>{
    //      console.log(data)
    //       this.setData(data)
    //       const { sceneCardList } = data;
    //       // 根据当前分辨率计算实际大小
    //       if(Array.isArray(sceneCardList)){
    //         const  { screenHeight ,screenWidth ,pixelRatio} = my.getSystemInfoSync();
    //         console.log(screenHeight ,screenWidth)
    //         // 计算图片大小dpr
    //         let newCardList = []
    //         for(let i = 0;i<sceneCardList.length;i++){
    //               let dprH = 1;
    //               let dprW = 1;
    //               const card = sceneCardList[i];
    //               const imageInfo = await this.getImageInfo(card.demoPic);
    //               console.log(imageInfo)
    //               if(imageInfo.width){
    //                 dprW = imageInfo.width / screenWidth;
    //               }
    //               if(imageInfo.height){
    //                 dprH = imageInfo.height / screenHeight;
    //               }
    //               console.log('dprW',dprW,'dprH',dprH)
    //               newCardList.push({
    //                 ...card,
    //                 height:card.height/dprH,
    //                 width:card.width/dprW,
    //                 placeHolderX:card.placeHolderX /dprW,
    //                 placeHolderY:card.placeHolderY /dprH,
    //               })
    //         }
    //         console.log(newCardList)
    //         this.setData({
    //           sceneCardList:newCardList,
    //           nowCardItem:newCardList[this.data.nowCardIndex]
    //         })
    //       }
          
    //    }
    //  })
    
  },
  swiperOnchange(event){
    const { detail :{ current }} = event;
    console.log(this.data.sceneCardList)
    this.setData({
      nowCardItem:this.data.sceneCardList[current],
      nowCardIndex:current
    })
     
  },
  getImageInfo(url){
      return new Promise((resolve)=>{
        my.getImageInfo({
          src:url,
          complete:resolve,
          
        })
      })
  }
});
