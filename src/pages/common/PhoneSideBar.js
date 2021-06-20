import React, { Component } from 'react';

export default class PhoneSideBar extends Component {

    static defaultProps = {
        letters: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }

    onLetterSelectedListener = (letter) => {
        this.props.onLetterSelectedListener && this.props.onLetterSelectedListener(letter);
    }

    render() {

        const letters = this.props.letters
        let letterViewArr = [];
        for (let i = 0; i < letters.length; i++) {
            letterViewArr.push(
                <div
                    key={i}
                    onPress={this.onLetterSelectedListener.bind(this, letters[i])}
                    style={{ width: 20, alignItems: 'center', justifyContent: 'center', height: 13 }}
                >
                    <span key={'letter' + i}
                        style={{ color: '#999999', fontSize: 12, paddingLeft: 2, paddingRight: 2 }}
                    >
                        {letters[i]}
                    </span>
                </div>
            );
        }
        return (
            <div
                style={{
                    position: 'absolute',
                    right: 20, width: 20,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    height: '100%'
                }}
            >
                {letterViewArr}
            </div>
        );
    }
}