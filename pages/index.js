import Head from 'next/head'
import dynamic from 'next/dynamic'
import ExampleComponent from "../components/CesiumGlobe";

const Cesium = dynamic(
  () => import('../components/Cesium'),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
      </Head>
      <ExampleComponent/>
    </>
  )
}
