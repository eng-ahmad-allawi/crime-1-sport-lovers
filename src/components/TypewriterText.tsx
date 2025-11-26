import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  className?: string;
  shouldAnimate?: boolean;
}

const TypewriterText = ({ text, className = '', shouldAnimate = true }: TypewriterTextProps) => {
  if (!shouldAnimate) {
    return <div className={className}>{text}</div>;
  }

  const characters = text.split('');

  return (
    <div className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: index * 0.02,
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default TypewriterText;
