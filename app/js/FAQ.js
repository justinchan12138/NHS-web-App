
import React from 'react';
import SourceList from './SourceList.js'

//Test Questions
//TODO: add proper questions
let sources = [{
				id:1,
				webpage: 'Insert Question Here',
				date: 'Answer is here too'
			},{
				id:2,
				webpage: 'What is Peach',
				date: 'A fruit'
}]

class FAQ extends React.Component{


	render () {

		return (
			<div id="Form">
			<h1>FAQ</h1>
			<SourceList sources = {sources}/>
			</div>
			)
	}


}
export default FAQ;
