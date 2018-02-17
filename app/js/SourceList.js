//functions updateSearch and render are from: https://www.youtube.com/watch?v=OlVkYnVXPl0&list=PLLnpHn493BHFfs3Uj5tvx17mXk4B4ws4p&index=16
import React from 'react';
import Source from './Source';

class SourceList extends React.Component {
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
		//Filter through the sources using the search bar
		let filteredSources = this.props.sources.filter(
			(source) => {
				return source.webpage.indexOf(this.state.search) !== -1;
			}
		);
		return (
			<div>

				<p id="searchField"> Search Field: <input type = "text"
					value = {this.state.search}
					onChange={this.updateSearch}/> </p>
            	<ul id="sourceItems">
					{	//
						filteredSources.map((source)=> {
						return <Source source={source} key={source.id}/>
					})}
				</ul>

			</div>
		)
	}
}

export default SourceList;
