import React, { Component } from 'react';


class Counter extends Component {
    state = {
        count: 10,
        imageUrl: "https://picsum.photos/200",
        tags: ["tag1", "tag2", "tag3"]
    }
    // constructor() {
    //     super()
    //     this.incrementHandler = this.incrementHandler.bind(this)
    // }
    renderTags() {
        if (this.state.tags.length === 0) return <p>There are no elements</p>
        return <ul>{this.state.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    }
    incrementHandler = () => {
        console.log("Increment is clicked", this.state.count)
        this.setState({count: this.state.count + 1})
    }

    render() { 
        const classes = this.getBadgeClasses()
        console.log(classes)
        return ( <div>
            {/* <img src={this.state.imageUrl} alt="" /> */}
            <span style={this.getStyles()} className={classes}>
            {this.formatCount()}
            </span> 
            <button onClick={this.incrementHandler} className='btn btn-primary'>
                Increment
                {/* <span style={this.getStyles()} className={classes}>
                {this.formatCount()}
                </span> */}
            </button>
            {this.renderTags()}
        </div>)

    }
    getBadgeClasses() {
        let classes = "badge m-2 bg-"
        classes += (this.state.count === 0 ? "warning" : "primary");
        return classes;
    }
    getStyles() {
        return {
            fontSize: 10,
            fontWeight: 'bold'
        }
    }
    formatCount() {
        const { count } = this.state;
        return count === 0 ? 'Zero' : count;
    }
}
 
export default Counter;