import {Model} from "@/types/modelTypes"
import ShieldButton from '@/components/ShieldButton';
import { Link } from 'wouter';

const ModelCard: React.FC<{ model: Model }> = ({ model }) => {
    return (
      <div className="model-card bg-[--navy-default] rounded-lg overflow-hidden border border-[--royal-default]/30 hover:border-[--gold-default]/30">
        <div className="aspect-square relative overflow-hidden">
          <div className="w-full h-full bg-[--navy-dark] grid-pattern">
            {model.thumbnailUrl ? (
              <img 
                src={model.thumbnailUrl} 
                alt={model.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="ri-cube-line text-5xl text-[--gold-default]/50"></i>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[--navy-default]/90 via-transparent to-transparent"></div>
          <div className="absolute top-3 right-3 flex space-x-1">
            <span className="bg-[--royal-default]/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
              {model.fileFormat}
            </span>
            {model.featured && (
              <span className="bg-[--gold-default]/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-[--navy-default] font-semibold">
                Featured
              </span>
            )}
            {model.price === 0 && (
              <span className="bg-emerald-600/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
                Free
              </span>
            )}
          </div>
          <h3 className="absolute bottom-3 left-3 right-3 font-cinzel font-bold text-white text-lg">
            {model.title}
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[--royal-default] overflow-hidden border border-[--gold-default]/20">
                <div className="w-full h-full bg-[--royal-dark] flex items-center justify-center">
                  <i className="ri-user-3-line text-[--gold-default]"></i>
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-300">
                by <Link href={`/profile/${model.userId}`}><a className="text-[--gold-default] hover:underline">{model.creatorName}</a></Link>
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <i className="ri-eye-line mr-1"></i>
              <span>{model.views}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {model.price > 0 ? (
              <div className="flex flex-col items-start text-[--gold-default] font-bold leading-tight">
              <span className="text-lg">{(model.price / 100).toFixed(2)}</span>
              <span className="text-sm font-normal text-gray-400">USD</span>
            </div>
            ) : (
              <span className="text-emerald-500 font-bold">Free</span>
            )}
            <Link href={`/model/${model.id}`}>
              <ShieldButton variant="secondary" size="sm" leftIcon={<i className="ri-download-line"></i>}>
                Download
              </ShieldButton>
            </Link>
          </div>
        </div>
      </div>
    );
  };

export default ModelCard;