import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

const useKeyboard = () => {
  const [keys, setKeys] = useState({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeys((k) => ({ ...k, left: true }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeys((k) => ({ ...k, right: true }));
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeys((k) => ({ ...k, left: false }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeys((k) => ({ ...k, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

function Player({ playerX }) {
  const meshRef = useRef();
  const keys = useKeyboard();
  const speed = 10;

  useEffect(() => {
    if (meshRef.current) meshRef.current.position.set(0, 0.5, 0);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const dt = Math.min(delta, 0.1);
    
    if (keys.left) meshRef.current.position.x -= speed * dt;
    if (keys.right) meshRef.current.position.x += speed * dt;

    if (meshRef.current.position.x < -9) meshRef.current.position.x = -9;
    if (meshRef.current.position.x > 9) meshRef.current.position.x = 9;

    playerX.current = meshRef.current.position.x;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function Obstacle({ startZ, playerX, setGameOver }) {
  const meshRef = useRef();
  const speed = 15;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set((Math.random() - 0.5) * 18, 0.5, startZ);
    }
  }, [startZ]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const dt = Math.min(delta, 0.1);
    meshRef.current.position.z += speed * dt;
    
    if (
      meshRef.current.position.z > -0.5 && 
      meshRef.current.position.z < 0.5 &&
      Math.abs(meshRef.current.position.x - playerX.current) < 1
    ) {
      setGameOver(true);
    }
    
    if (meshRef.current.position.z > 10) {
      meshRef.current.position.z = -50;
      meshRef.current.position.x = (Math.random() - 0.5) * 18;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const playerX = useRef(0);

  useEffect(() => {
    let interval;
    if (!gameOver) {
      interval = setInterval(() => setScore((s) => s + 1), 500);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  const restart = () => {
    setGameOver(false);
    setScore(0);
    playerX.current = 0;
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10, fontSize: '24px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
        Skor: {score}
      </div>

      {gameOver && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>OYUN BİTTİ</h1>
          <h2 style={{ fontSize: '32px', margin: '0 0 40px 0' }}>Skorun: {score}</h2>
          <button onClick={restart} style={{ padding: '15px 30px', fontSize: '20px', cursor: 'pointer', backgroundColor: 'hotpink', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>
            Tekrar Oyna
          </button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 10, 10]} intensity={1.5} />
        
        {!gameOver && (
          <>
            <Player playerX={playerX} />
            <Obstacle startZ={-20} playerX={playerX} setGameOver={setGameOver} />
            <Obstacle startZ={-40} playerX={playerX} setGameOver={setGameOver} />
            <Obstacle startZ={-60} playerX={playerX} setGameOver={setGameOver} />
          </>
        )}

        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -25]}>
          <planeGeometry args={[20, 150]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;