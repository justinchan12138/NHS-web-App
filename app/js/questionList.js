
import React from 'react';
import Question from './Question.js';

//List of frequently asked qustions
class QuestionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''
	}
	this.updateSearch = this.updateSearch.bind(this);

}

	updateSearch(event) {
		this.setState({search: event.target.value.substr(0,20)});
	}

	render () {
		//Filter through the questions using the search bar
		let filteredQuestions = this.props.questions.filter(
			(question) => {
				return question.Question.indexOf(this.state.search) !== -1;
			}
		);
		return (
			<div>
				<ul>
					{filteredQuestions.map((question)=> {
						return <Question question={question} key={question.id}/>
					})}
				</ul>
				<input type = "text"
					value = {this.state.search}
					onChange={this.updateSearch}/>

				<input type = "text"
					value = {this.state.search}
					onChange={this.updateSearch.bind(this)}/>
			</div>
		)
	}
}

export default QuestionList;
