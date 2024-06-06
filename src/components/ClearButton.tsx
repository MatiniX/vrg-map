import { useOL } from 'rlayers';

const ClearButton = () => {
  const map = useOL();
  return (
    <button
      className="center"
      onClick={() => {
        confirm('Are you sure you want to clear all measurements?');
        console.log('Clearing all measurements');
        map.map.getLayers().forEach((layer) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const source = layer.getSource();
          source.clear();
        });
        map.map.dispatchEvent('clear');
      }}
    >
      x
    </button>
  );
};

export default ClearButton;
