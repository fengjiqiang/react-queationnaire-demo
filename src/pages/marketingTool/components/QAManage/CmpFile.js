import React, { useState } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLButton, RLDivider, RLTextarea, RLSwitch } from '@components/index.js'
import actionQAManage from '@actions/marketingTool/actionQAManage.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'

const CmpFile = (props) => {
    const { src, name, onDelete, editable } = props;
    const [hover, setHover] = useState(false);
    const isPDF = src && src.endsWith('.pdf') ? true : false;
    return <div style={{width: 500,height:40,backgroundColor: hover ? '#eeddde':'', display: 'flex', flexDirection: 'row', alignItems:'center',marginTop:5,marginBottom:5,cursor:'pointer'}}
                onMouseEnter = {()=>{
                    setHover(true);
                }}
                onMouseLeave = {()=>{
                    setHover(false);
                }}
                onClick={()=>{
                    props.click && props.click()
                }}
            >
            <img src={isPDF ? require('@/assets/images/pdf.png').default: require('@/assets/images/picture.png').default} style={{width:18,height:18}}/>
            <div style={{marginLeft: 10, width:'80%',whiteSpace: 'nowrap', textOverflow: 'ellipsis',overflow: 'hidden'}}>{name}</div>
            {
                editable ? 
                <>
                   {hover ? 
                        <img src={require('@/assets/images/file_delete.png').default}
                            onClick={()=>{
                                onDelete()
                            }}
                            style={{width:10,height:10, cursor:'pointer'}}
                        /> : 
                        <img src={require('@/assets/images/file.png').default} style={{width:10,height:10}}/>
                    }
                </> : <></>
            }    
        </div>
}
export default CmpFile;