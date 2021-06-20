import { getData, getFile } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
import config from '@/config.js'
import CmpPhoneImport from '../../../pages/userManage/components/phoneList/CmpPhoneImport'
const actionPhoneList = {
    getPhoneList(data){
        return getData({
            method:'get',
            url: interfaces.PHONE_LIST,
            data: data
        });
    },
    phoneDel(data){
        return getData({
            method:'get',
            url: interfaces.PHONE_DELETE,
            data: data
        });
    },
    phoneImport(data){
        return getData({
            method:'POST',
            url: interfaces.PHONE_IMPORT,
            data: data
        });
    },
    downloadTemplate(){
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = '';
        link.setAttribute('download', '固话导入模版.xlsx');
        document.body.appendChild(link);
        link.click();
    }
}
export default actionPhoneList;