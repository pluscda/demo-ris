export const dateFormatMixin = {
	methods: {
		DateToString: function(d, includeTime){
			if (d) {
				let formatted_date = d.getFullYear() + "/" + this.SinglgeNumTo2Digit(d.getMonth()+1) + "/" + this.SinglgeNumTo2Digit(d.getDate())
				let formatted_time = " " + this.SinglgeNumTo2Digit(d.getHours()) + ":" + this.SinglgeNumTo2Digit(d.getMinutes()) + ":" + this.SinglgeNumTo2Digit(d.getSeconds())
				if(includeTime)
					formatted_date += formatted_time
				return formatted_date
			}
			return null
		},
		SinglgeNumTo2Digit: function(n){
			let nt = ""+n
			nt = (n>=10 ? nt:"0"+nt)
			return nt
		},
	}
}