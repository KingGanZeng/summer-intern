import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import InputItem from '../src/components/InputItem';
import $ from 'jquery';
import close from './icon_close.png';


class InputHeader extends React.Component
{
    render()
    {
        return(
        <div className="input_header">
            <div className="input_header_left"><img className='edit_img' src={require('./icon_edit.png')} alt=''/>Edit Entry</div>
            <div className="input_header_right"><img className='close_img' src={close} alt=''/></div>
        </div>
        );
    }
}


class InputItemPanel extends React.Component
{
    
    render()
    {
        let items = [];
        this.props.items.forEach(item => {
            items.push(<InputItem key={item.key} item={item}/>);
        });

        return (
            <div className="input_container"> {items} 
                <div className='data_item'>
                    <DatePicker defaultValue={moment()}/>
                </div>
            </div>
        );
    }
}

class InputFooter extends React.Component
{
    handleClick(event)
    {
        var btn = event.target,
            $btn = $(btn);
        var $main_box = $($btn.parent().prevAll()[1]),
            $input_box = $main_box.find('input');

        var formData = new FormData();
        //格式判断
        for(var i = 0, length = $input_box.length; i < length; i++) {
            var $input_box_item = $($input_box[i]),
                data_type = $input_box_item.data('type'),
                data_id = $input_box_item.attr("id"),
                input_content = $input_box_item.val();
            
                
            if(input_content === '') {
                alert('Please input all items.');
                $input_box_item.focus();    //输错框聚焦
                return ;
            } else {
                //日期正则匹配
                var reg = /^((((19|20)\d{2})-(0?[13-9]|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
                var regExp = new RegExp(reg);

                if(data_type === 'integer')
                {
                    input_content = parseFloat(input_content, 10);        //因为取到输入框为字符串，这里转换为float型，第二个参数表示转化为10进制
                    if(Math.floor(input_content) === input_content) {
                        formData.set(data_id, input_content);
                    } else {
                        alert('Please input the right integer.');
                        $input_box_item.val('');        //输入框置为空
                        $input_box_item.focus();        //输错框聚焦
                        return ;
                    }
                } else if(data_type === 'less_than_hundred') {
                    if(input_content <= 100 && input_content > 0) {
                        formData.set(data_id, input_content);
                    } else {
                        alert('Please input the right number (less than hundred).');
                        $input_box_item.val('');        //输入框置为空
                        $input_box_item.focus();        //输错框聚焦
                        return ;
                    }
                } else if(data_type === 'date') {
                    if(regExp.test(input_content) ) {
                        formData.set(data_id, input_content);
                    } else {
                        alert('Please input the right date .');
                        $input_box_item.val('');        //输入框置为空
                        $input_box_item.focus();        //输错框聚焦
                        return ;
                    }
                } else if(data_type === 'yes_or_blank') {
                    if(input_content === 'yes' || input_content === 'blank') {
                        formData.set(data_id, input_content);
                    } else {
                        alert('Please input the right date .');
                        $input_box_item.val('');        //输入框置为空
                        $input_box_item.focus();        //输错框聚焦
                        return ;
                    }
                }
            }
        }

        //日期错误判断
        var $data_from = $($input_box[18]),
            $data_to = $($input_box[19]);
        var data_from_value = $data_from.val().split('-'),
            data_to_value = $data_to.val().split('-');
        if(data_from_value[0] > data_to_value[0]) {
            alert('Please input the right date!');
            $data_from.val('');
            $data_from.focus();
            return ;
        } else if(data_from_value[0] === data_to_value[0]) {
            if(data_from_value[1] > data_to_value[1]) {
                alert('Please input the right date!');
                $data_from.val('');
                $data_from.focus();
                return ;
            } else if(data_from_value[1] === data_to_value[1]) {
                if(data_from_value[2] > data_to_value[2]) {
                    alert('Please input the right date!');
                    $data_from.val('');
                    $data_from.focus();
                    return ;
                } else if(data_from_value[2] === data_to_value[2]) {
                    alert('Please input the right date!');
                    $data_from.val('');
                    $data_from.focus();
                    return ;
                }
            }
        }

        //ajax请求发送
        $.ajax({
            url: '127.0.0.1',       //接口url 参考 https://blog.csdn.net/zrcj0706/article/details/78639548
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                console.log('成功！');
                alert('发送成功');
            },
            error: function(xhr, status, err) {
                alert('发送失败' + status + err);
            }
        });
    }
    render()
    {
        return( 
            <div className="footer_btn">
                <div className='btn btn_cancel'>Cancel</div>
                <div className='btn btn_update' onClick={this.handleClick}>Update</div>
            </div>
        );
    }
}

var rawData = [
    {info: {id:'1',type:'integer',title:'DownTime', value:'', placeholder:'Multiplt values', notice:'The selected items contain different values for this value.\nTo edit it and set all items for this input to the same value.'}},
    {info: {id:'2',type:'integer',title:'Response Time', value:'8', placeholder:'', notice:''}},
    {info: {id:'3',type:'less_than_hundred',title:'First Call Competion', value:'80', placeholder:'', notice:''}},
    {info: {id:'4',type:'integer',title:'PM Accept.Range Minus', value:'', placeholder:'Multiplt values', notice:''}},
    {info: {id:'5',type:'integer',title:'PM Acceptance Range Plus', value:'', placeholder:'', notice:'All selected items are null.\nEdit and set all entries for this input to the new value'}},
    {info: {id:'6',type:'less_than_hundred',title:'On Time PM Completion', value:'100', placeholder:'', notice:''}},
    {info: {id:'7',type:'integer',title:'Calibrations Accept.Range Minus', value:'', placeholder:'Multiplt values', notice:''}},
    {info: {id:'8',type:'integer',title:'Calibrations Accepetence Range Plus', value:'', placeholder:'', notice:''}},
    {info: {id:'9',type:'less_than_hundred',title:'On Time Calibrations Completion', value:'', placeholder:'', notice:''}},
    {info: {id:'10',type:'integer',title:'Qualifications Acceptance Range Minus', value:'', placeholder:'', notice:''}},
    {info: {id:'11',type:'integer',title:'Qualifications Acceptance Range Plus', value:'', placeholder:'', notice:''}},
    {info: {id:'12',type:'less_than_hundred',title:'On Time Qualifications Completion', value:'', placeholder:'', notice:''}},
    {info: {id:'13',type:'integer',title:'Checks Acceptance Range Minus', value:'', placeholder:'', notice:''}},
    {info: {id:'14',type:'integer',title:'Checks Acceptance Range Plus', value:'', placeholder:'', notice:''}},
    {info: {id:'15',type:'less_than_hundred',title:'On Time Checks Completion', value:'', placeholder:'', notice:''}},
    {info: {id:'16',type:'integer',title:'Contracted Reponse', value:'', placeholder:'', notice:''}},
    {info: {id:'17',type:'integer',title:'Contracted Downtime', value:'', placeholder:'', notice:''}},
    {info: {id:'18',type:'yes_or_blank',title:'Scheduled Services Due Within Month', value:'', placeholder:'Please input: yes or blank', notice:''}},
    {info: {id:'19',type:'date',title:'Date applicable from', value:'', placeholder:'Input format: YYYY-MM-DD', notice:''}},
    {info: {id:'20',type:'date',title:'Date applicable to', value:'', placeholder:'Input format: YYYY-MM-DD', notice:''}},
];

class InputBox extends React.Component 
{
    render() 
    {
        return(
            <div className="input_box">
              <InputHeader/>
              <div className='main_box'>
                <InputItemPanel className='inner_box' items={rawData} />
              </div>
              <div className="footer-line"></div>
              <InputFooter/>
            </div>
        );
    }
}

ReactDOM.render(<InputBox />, document.getElementById('root'));



