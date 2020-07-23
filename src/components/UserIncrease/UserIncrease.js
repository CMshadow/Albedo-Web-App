import React from 'react';
import './UserIncrease.scss';

const date1 = new Date("07/18/2020");
const date2 = new Date();

const Difference_In_Time = date2.getTime() - date1.getTime();
const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
//const State = 203 + Math.round(Math.random()*4+2) * Difference_In_Days;
const userIncrease=(props)=>(
    <div class="box">
        <p class="box-item">
        <span>{props.count+Math.round(props.increase) * Difference_In_Days}</span>
        </p>
    </div>
        
);
export default userIncrease;