import React from 'react';
import SourceList from './SourceList.js'

//testSources
//TODO add the proper documentation
let sources = [{
				id:1,
				webpage: 'wiki',
				date: 'jan'
			},{
				id:2,
				webpage: 'nhs',
				date: 'feb'

}]

class Documentation extends React.Component{
	render () {
		return (
			<div id= "Form">
				<h1 id="extraLargeHeading">Source List</h1>
				<SourceList sources = {sources}/>
			</div>
			)
	}

}
export default Documentation;
