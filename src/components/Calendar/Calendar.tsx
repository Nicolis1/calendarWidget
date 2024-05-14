import React, { useState } from 'react';
import './Calendar.css'

const MONTH_LOOKUP = ["January", "February", "March", "April","May","June", "July", "August", "Sepetember", "October", "November", "December"]

type nullishDate = Date | null;
type Date = {
    index:number,
    day:number,
    number:number,
    month:number,
    year:number,
}
function getDatesUtil(){
   
    let firstDate = new Date(new Date().getFullYear(), 0, 1);
    let dates:Date[] = [];
    while(firstDate.getMonth() < 12){
        dates.push(  {
            index:dates.length,
            day:firstDate.getDay(),
            number:firstDate.getDate(),
            month:firstDate.getMonth(),
            year:firstDate.getFullYear(),

        });
        firstDate.setHours(firstDate.getHours()+24);
    }

    return dates;
}


const Calendar = (props:{})=>{
    const dates = getDatesUtil();
    const [startDate, setStartDate] = useState<nullishDate>(null);
    const [endDate, setEndDate] = useState<nullishDate>(null);
    let monthOfDates:Date[][] = [];
    for(let date of dates){
        if(monthOfDates[date.month] != null){
            monthOfDates[date.month].push(date)
        }
        else{
            monthOfDates[date.month] = [date];
        }
    }
    const monthCal = monthOfDates.map((month, monthIndex) =>{
        let weeks:nullishDate[][] = [[]];
        for(let date of month){
            if(date.day===0 && weeks[weeks.length-1].length > 0){
                weeks.push([]);
            }
            weeks[weeks.length-1].push(date);
        }
        for(let daysOfWeek = weeks[weeks.length-1].length; daysOfWeek<7; daysOfWeek++){
            weeks[weeks.length-1].push(null)
        }

        const monthRows = weeks.map((week,weekIndex)=>{
            return <tr key={`month${monthIndex}week${weekIndex}`}>{
                    [...new Array(7-week.length)].map((x,i)=>{return <td key={`spacer${i}week${weekIndex}`}> </td>})}
                    {week.map(date=>{
                        let className = '';
                        if(startDate!=null && date!=null && date.index === startDate.index){
                            className = 'startDate';
                        }
                        else if (endDate!=null && date!=null && date.index ===endDate.index){
                            className = 'endDate'
                        }
                        else if(startDate !=null && endDate!=null && date!=null && date.index<endDate.index && date.index > startDate.index){
                            className = 'betweenDate'
                        }
                        return date && <td key={`month${monthIndex}date${date.number}`} 
                            className={className}
                            onClick={()=>{
                                if(!startDate){
                                    setStartDate(date);
                                    return;
                                }
                                if(startDate && !endDate  && Math.abs(date.index - startDate.index) < 7 ){
                                    if(date.index >= startDate.index){
                                        setEndDate(date);
                                    }
                                    else{
                                        setEndDate(startDate);
                                        setStartDate(date);
                                    }
                                    return;
                                }
                                if(endDate && startDate){
                                    setEndDate(null);
                                    setStartDate(date);
                                }

                            }}>{date.number}</td>})}
                </tr>
        });
        return <React.Fragment key={`fragmentWrapper${monthIndex}`}>
                <tr key={`monthBarSpan${monthIndex}`} className='monthIdentifierSpan'><td colSpan={7}>{`${MONTH_LOOKUP[month[0].month]} ${month[0].year}`}</td></tr>
                {monthRows}
            </React.Fragment>

    })
   
    
   
    return <div className='calendarWrapper'>
        <div className='calendarContents'>
            <div className='calendarTabs'/>
            <div className='calendarTitleBar'/>
            <div className='calendarDates'>
                <table>
                    <thead>
                        <tr className='calendarDatesHeader'>
                            <th>S</th>
                            <th>M</th>
                            <th>T</th>
                            <th>W</th>
                            <th>T</th>
                            <th>F</th>
                            <th>S</th>
                        </tr>
                    </thead>
                    <tbody>{monthCal}</tbody>
                </table>
            </div>
            <div className='actionButton'><button onClick={()=>{
                if(!startDate || !endDate){
                    alert("Select both a start and end date");
                    return;
                }
                let selectedDates = [];
                for(let i = startDate.index; i<=endDate.index;i++){
                    selectedDates.push(`${MONTH_LOOKUP[dates[i].month]} ${dates[i].number}`)
                }
                alert(selectedDates)
            }}>Apply</button><button onClick={()=>{
                setEndDate(null);
                setStartDate(null);
            }}>Clear</button></div>
        </div>
    </div>
}
export default Calendar;