import React from 'react';


class Source extends React.Component {
	//A documentation source
	render () {
		return (
			<li>
				{this.props.source.webpage} {this.props.source.date}
			</li>
		)
	}
}

export default Source;
