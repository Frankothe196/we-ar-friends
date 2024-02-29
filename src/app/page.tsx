import Head from 'next/head';
import ThreeScene from './components/Scene';

const Home = () => {
  return (
    <div>
      <Head>
        <title>React Three Fiber App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ThreeScene />
    </div>
  );
};

export default Home;