
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectGenerator } from "@/components/ProjectGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScratchApi, ScratchProject } from "@/hooks/useScratchApi";
import Icon from "@/components/ui/icon";

// Предопределенные ссылки для разных типов проектов
const PROJECT_URLS = {
  scratch: {
    game: "https://scratch.mit.edu/projects/editor/?tutorial=getStarted",
    animation: "https://scratch.mit.edu/projects/editor/?tutorial=animate-a-name",
    story: "https://scratch.mit.edu/projects/editor/?tutorial=create-a-story",
    default: "https://scratch.mit.edu/projects/editor/"
  },
  turbowarp: {
    game: "https://turbowarp.org/editor?tutorial=getStarted",
    animation: "https://turbowarp.org/editor?tutorial=animate-a-name",
    story: "https://turbowarp.org/editor?tutorial=create-a-story",
    default: "https://turbowarp.org/editor"
  }
};

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("scratch");
  const [includeSprites, setIncludeSprites] = useState(true);
  const [includeBackgrounds, setIncludeBackgrounds] = useState(true);
  const [includeMusic, setIncludeMusic] = useState(false);
  const [projectData, setProjectData] = useState<null | { 
    title: string; 
    description: string; 
    url: string; 
    image?: string;
    id?: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<ScratchProject[]>([]);

  // Используем хук для работы с API Scratch
  const { 
    searchProjects, 
    getFeaturedProjects, 
    loading: apiLoading, 
    error: apiError 
  } = useScratchApi();

  // При монтировании компонента загружаем популярные проекты
  useEffect(() => {
    const loadFeaturedProjects = async () => {
      const projects = await getFeaturedProjects(4);
      setFeaturedProjects(projects);
    };
    
    loadFeaturedProjects();
  }, [getFeaturedProjects]);

  // Определяет тип проекта на основе запроса
  const determineProjectType = (promptText: string) => {
    promptText = promptText.toLowerCase();
    
    if (promptText.includes("игр") || promptText.includes("платформер") || promptText.includes("аркад")) {
      return "game";
    } else if (promptText.includes("анимац") || promptText.includes("движен")) {
      return "animation";
    } else if (promptText.includes("истор") || promptText.includes("рассказ") || promptText.includes("сказк")) {
      return "story";
    }
    
    return "default";
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    
    try {
      // Ищем существующие проекты по запросу в API Scratch
      const searchResults = await searchProjects(prompt, 5);
      
      if (searchResults.length > 0) {
        // Берем первый найденный проект как образец
        const sampleProject = searchResults[0];
        
        // Создаем новый проект на основе найденного
        const newProject = {
          title: `${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
          description: `Проект создан на основе "${sampleProject.title}". ${sampleProject.description || ''}`,
          url: platform === 'scratch' 
            ? `https://scratch.mit.edu/projects/${sampleProject.id}/editor` 
            : `https://turbowarp.org/${sampleProject.id}/editor`,
          image: sampleProject.thumbnail_url || undefined,
          id: sampleProject.id
        };
        
        setProjectData(newProject);
        setIsSuccess(true);
      } else {
        // Если проекты не найдены, используем предопределенные шаблоны
        const projectType = determineProjectType(prompt);
        const projectUrl = PROJECT_URLS[platform as keyof typeof PROJECT_URLS][
          projectType as keyof typeof PROJECT_URLS.scratch
        ];
        
        const newProject = {
          title: `${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
          description: `Проект ${platform === 'scratch' ? 'Scratch' : 'TurboWarp'} создан на основе запроса: ${prompt}. Включает ${includeSprites ? 'спрайты, ' : ''}${includeBackgrounds ? 'фоны, ' : ''}${includeMusic ? 'музыку' : ''}`,
          url: projectUrl,
          image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop"
        };
        
        setProjectData(newProject);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      alert('Произошла ошибка при создании проекта. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const openProject = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">Генератор проектов Scratch/TurboWarp</h1>
          <p className="text-xl text-gray-600">Создавайте уникальные проекты по вашему запросу с использованием API Scratch</p>
        </header>

        {apiError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-md text-red-800">
            Ошибка API Scratch: {apiError}
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-md text-green-800">
            Проект успешно создан! Вы можете открыть его и начать работу.
          </div>
        )}

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="generator">Генератор</TabsTrigger>
            <TabsTrigger value="examples">Примеры проектов</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>Создайте новый проект</CardTitle>
                <CardDescription>Опишите, что вы хотите создать, и выберите настройки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="prompt" className="text-lg font-medium mb-2 block">Ваш запрос:</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="Например: игра-платформер с котом, который собирает монеты"
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="platform" className="text-lg font-medium mb-2 block">Платформа:</Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите платформу" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scratch">Scratch</SelectItem>
                          <SelectItem value="turbowarp">TurboWarp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">Дополнительные опции:</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sprites">Включить спрайты</Label>
                        <Switch 
                          id="sprites" 
                          checked={includeSprites} 
                          onCheckedChange={setIncludeSprites} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="backgrounds">Включить фоны</Label>
                        <Switch 
                          id="backgrounds" 
                          checked={includeBackgrounds} 
                          onCheckedChange={setIncludeBackgrounds} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="music">Включить музыку</Label>
                        <Switch 
                          id="music" 
                          checked={includeMusic} 
                          onCheckedChange={setIncludeMusic} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    disabled={isLoading || apiLoading}
                    size="lg"
                  >
                    {isLoading || apiLoading ? "Поиск и создание проекта..." : "Сгенерировать проект"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {projectData && <ProjectGenerator projectData={projectData} />}
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Популярные проекты Scratch</CardTitle>
                <CardDescription>Реальные проекты из API Scratch</CardDescription>
              </CardHeader>
              <CardContent>
                {apiLoading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader" className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
                    <p>Загрузка проектов из API Scratch...</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {featuredProjects.length > 0 ? (
                      featuredProjects.map(project => (
                        <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                          <p className="mb-3 text-gray-600">{project.description || 'Нет описания'}</p>
                          <div 
                            className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden"
                            style={{
                              backgroundImage: project.thumbnail_url ? `url(${project.thumbnail_url})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            {!project.thumbnail_url && (
                              <span className="text-gray-400">Нет изображения</span>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => openProject(`https://scratch.mit.edu/projects/${project.id}`)}
                          >
                            Открыть проект
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <p>Проекты не найдены или произошла ошибка загрузки.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => getFeaturedProjects(4).then(setFeaturedProjects)}
                        >
                          Попробовать еще раз
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
