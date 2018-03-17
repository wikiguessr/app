import React, { Component } from 'react'
import './app.css'

import * as d3 from 'd3'
import * as cloud from 'd3-cloud'


class App extends Component {

  componentDidMount() {
    let url = 'https://gist.githubusercontent.com/g1eb/ab5a80baf6ca9598e76b45aed271c107/raw/7d2e6e04e7c051e1e66f09e2283bc8e2f2b391d1/output.json'

    this.getData(url)


    this.width = 960
    this.height = 500

    this.colors = d3.scaleOrdinal(d3.schemeCategory20)
  }

  getData(url) {
    d3.json(url, (error, data) => {
      if (error) { throw error }
      this.setup(data)
    })
  }

  setup(data) {
    this.colors.domain([d3.max(data, d => d.size), 0])

    let layout = cloud()
      .size([this.width, this.height])
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', (words) => this.draw(words))
    layout.words(data)
    layout.start()
  }

  draw(words) {
    d3.select(this.refs.app)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500')
      .attr('class', 'svg')
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
      .selectAll('text')
      .data(words)
      .enter().append('text')
      .style('font-size', d => d.size + 'px')
      .style('font-family', 'Impact')
      .style('opacity', 0)
      .style('fill', d => this.colors(d.size))
      .attr('text-anchor', 'middle')
      .attr('transform', d => {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
      })
      .text(d => d.text)
      .transition()
      .delay((d, i) => 250 * (i + 1) / 10)
      .duration(250)
      .ease(d3.easeLinear)
      .style('opacity', 1)
  }

  render() {
    return (
      <div className='app' ref='app'></div>
    )
  }
}

export default App
