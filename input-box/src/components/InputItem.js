import React from 'react';
import '../../src/index.css';
import $ from 'jquery';

class InputItem extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state = {
            value: this.props.item.info.value, 
            type: this.props.item.info.type,
            type_id: this.props.item.info.id
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) 
    {
        this.setState({value: event.target.value});
    }
    handleClick(event)
    {
        var input = event.target,
        $input = $(input),
        $input_notice = $input.next();
        if($input_notice.text()) {
            $input_notice.show();
          }
    }
    render() 
    {
      var value = this.state.value;
      var type_id = this.state.type_id;
      var type = this.state.type;
      var placeholder = this.props.item.info.placeholder;
      var title = this.props.item.info.title;
      var notice = this.props.item.info.notice;
      return (<div className="item_input_container">
                <div className='item_title'>{title}</div>
                <div className='item_input_inner'>
                    <input type="text" id={type_id} data-type={type} value={value} placeholder={placeholder} onClick={this.handleClick} onChange={this.handleChange} /> 
                    <div className="input_notice">{notice}</div>
                </div>
            </div>);
    }
}

export default InputItem;