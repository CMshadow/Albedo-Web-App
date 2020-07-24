import React from 'react';
import './UserIncrease.scss';

const date1 = new Date("07/18/2020");
const date2 = new Date();

const Difference_In_Time = date2.getTime() - date1.getTime();
const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
//const State = 203 + Math.round(Math.random()*4+2) * Difference_In_Days;
function thousands(num){
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg,"$1,");
}
const userIncrease=(props)=>(
    <div class="box">
        <p class="box-item">
            <span>{thousands(props.count+Math.round(props.increase) * Difference_In_Days)}{props.name}</span>
        </p>
    </div>
        
);
export default userIncrease;