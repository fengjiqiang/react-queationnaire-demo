import React, { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js';
import { RLButton, RLModal } from '@components/index.js'

import videojs from 'video.js';
import 'videojs-contrib-hls';

import 'video.js/dist/video-js.css';

import videozhCN from 'video.js/dist/lang/zh-CN.json';

import './CmpVideoPlayer.less';

videojs.addLanguage('zh-CN', videozhCN);

export default class VideoPlayer extends BaseCmp {
    constructor(props){
        super(props);
        this.state = {};
        this.video = createRef();
        this.totalTime = 0;
    }

    componentDidMount() {
        //播放器配置项

        this.config = {
            autoPlay: true,
            language: 'zh-CN',
            controls: true,
            preload: 'auto',
            userActions: {
                hotkeys: false
            },
            bigPlayButton: true,
            textTrackDisplay: false,
            posterImage: true,
            errorDisplay: false,
            controlBar: {
                children:{
                    playToggle: true,
                    volumePanel: {
                        inline: false
                    }, 
                    currentTimeDisplay: true,
                    progressControl: true,
                    durationDisplay:true,
                    fullscreenToggle: true
                },
            },
            hls: {
                withCredentials: true,
                overrideNative: true
            },
            html5: {
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            }
        };

        this.player = videojs(this.video, this.config, 
            
            function onPlayerReady(){
                
                console.log('-----player is ready------')
                // this.play();
                this.on('error', () => {
                    console.log('---------播放出错----------');
                });
                this.on('ended', () => {
                    console.log('-----------播放结束-----------');
                });

                this.on('timeupdate', () => {
                    // let currentTime = Math.floor(this.currentTime());
                    // console.log('-----------播放时间----------', currentTime)
                    // if (currentTime > 0 && currentTime > this.totalTime && (currentTime % 5 === 0)) {
                    //     //每隔5秒，向服务器提交播放时间(秒)
                    //     console.log('-----------播放时间----------', currentTime);
                    // }
                    // this.totalTime = currentTime;
                });

            },
        );
    }
    componentWillUnmount() {
        if(this.player){
            this.player.dispose();
        }
    }
    render(){
        return (
            <RLModal 
                className="video-player"
                title="视频预览"
                onCancel={this.props.close}
                footer={null}
                forceRender={true}
                visible={this.props.visible}
            >
                <div style={{display:'flex',flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
                    <div style={{width:560,height:315}}>
                        <video 
                            id="myVideo"
                            ref={node => this.video = node} 
                            className="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            preload="auto"
                            playsInline
                            style={{width:'100%',height:'100%'}}
                        >
                            <source src={this.props.src } type="application/x-mpegURL"/>
                        </video>
                    </div>
                </div>
            </RLModal>
        )
    }
}