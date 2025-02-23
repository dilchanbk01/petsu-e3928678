
interface ConsultationHeroProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

const ConsultationHero = ({ 
  imageUrl = '/lovable-uploads/88a72a86-7172-46fe-92a9-7b28369dcfbd.png',
  title = "Instant Vet Consultation",
  subtitle = "Connect with licensed veterinarians 24/7"
}: ConsultationHeroProps) => {
  return (
    <div 
      className="relative h-[300px] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-petsu-blue/80 to-transparent">
        <div className="container mx-auto h-full flex items-center">
          <div className="max-w-2xl text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationHero;
