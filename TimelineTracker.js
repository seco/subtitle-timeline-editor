var TimelineTracker = (function(){
	"use strict";
	function TimelineTracker(tl) {
		this.tl = tl;
		this.events = [];
	}

	TimelineTracker.prototype.addEvent = function(evt) {
		this.events.push(evt);
		this.updateDebug();
	};
	
	TimelineTracker.prototype.undo = function() {
		var e, s, track;
		if(this.events.length == 0)
			return;

		e = this.events.pop();
		track = this.tl.getTrack(e.attributes.track);
		s = track.getSegment(e.attributes.id);
		switch(e.type){
			case "resize":
			case "move":
				s.startTime = e.attributes.initialStart;
				s.endTime = e.attributes.initialEnd;
				break;
			case "create":
				s.deleted = true;
				break;
			case "delete":
				s.deleted = false;
				break;
			case "update":
				s.cue.text = e.attributes.initialText;
				break;
		}
		
		this.tl.renderTrack(track);
		this.updateDebug();
	};

	// Debug functions
	TimelineTracker.prototype.updateDebug = function(text) {
		if(this.debugElement){
			this.debugElement.innerHTML = text || this.toString();
		}
	};

	TimelineTracker.prototype.toString = function() {
		var i, s = "<pre>Events:\n";
		for(i in this.events) {
			s += this.events[i].toString("\t");
		}
		s += "</pre>";
		return s;
	};
	
	return TimelineTracker;
}());