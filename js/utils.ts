const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function strDate(date: Date): string {
    const now: Date= new Date();
    if(date.getFullYear() != now.getFullYear()){
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`; 
    }
    if(date.getMonth() != now.getMonth()){
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }
    if(date.getDate() == now.getDate()){
        const differece = now.getTime() - date.getTime();
        if( differece >= 0 && differece <= 60000){
            return "Just now";
        }else{
            return `${date.getHours()}h:${("00" +date.getMinutes()).slice(-2)}`;
        }
    } else if(date.getDate() == now.getDate()-1) {
        return "Yesteday";
    }else{
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }
    
}