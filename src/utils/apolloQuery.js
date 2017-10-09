import { gql } from 'react-apollo'

const QueryData = ( startDate, market, broker, strategy, indicatorNames ) => gql`
  query loadIndicatorData{
    marketIndicators(
      start:"${ startDate }",
      market:"${ market }",
      broker:"${ broker }",
      strategy:"${ strategy }",
      indicators:"${ indicatorNames }") {
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        indicators
      }

    chartConfig(strategy:"${ strategy }") {
      panels {
          name,
          indicators {
            name,
            type,
            style,
            color,
            width
          }
      }
    }
  }
`

export const QueryChartConfig = ( strategy ) => gql`
  query loadChartConfig{
    chartConfig(strategy:"${ strategy }") {
      panels {
          name,
          indicators {
            name,
            type,
            style,
            color,
            width
          }
      }
    }
  }
`

export const QuerySearch = ( searchKey ) => gql`
  query search {
    markets(term:"${ searchKey }") {
      id,
      symbol,
      name,
      type,
      exchange {
        id,
        name
      },
      brokers {
        id,
        name
      },
      sector {
        name
      },
      strategies {
        id,
        name
      }
    }
  }
`

export const QueryShare = gql`
  mutation chartImage ( $data: ChartImageInput! ) {
    createChartImage ( input: $data ) {
      url
    }
  }
`

export default QueryData