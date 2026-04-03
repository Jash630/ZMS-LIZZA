import { useEffect, useState } from 'react'
import { Header }             from '../components/layout/Header.jsx'
import { Footer }             from '../components/layout/Footer.jsx'
import { WhatsAppButton }     from '../components/shared/WhatsAppButton.jsx'
import { HeroSection }        from '../components/home/HeroSection.jsx'
import { WhyChooseSection }   from '../components/home/WhyChooseSection.jsx'
import { FeaturedProducts }   from '../components/home/FeaturedProducts.jsx'
import { SocialProofSection } from '../components/home/SocialProofSection.jsx'
import { TestimonialsSection } from '../components/home/TestimonialsSection.jsx'
import { GallerySection }     from '../components/home/GallerySection.jsx'
import { ServicesSection }    from '../components/home/ServicesSection.jsx'
import { BlogSection }        from '../components/home/BlogSection.jsx'
import { CTASection }         from '../components/home/CTASection.jsx'
import { publicService }      from '../services/publicService.js'

export function HomePage() {
  const [products, setProducts] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [featuredProductsRes, postsRes] = await Promise.all([
          publicService.getProducts({ limit: 6, featured: true }),
          publicService.getPosts({ limit: 3 }),
        ])
        const productItems = (featuredProductsRes.items || []).length
          ? featuredProductsRes.items
          : (await publicService.getProducts({ limit: 6 })).items

        if (!active) return
        setProducts(productItems || [])
        setPosts(postsRes.items || [])
      } catch {
        if (!active) return
        setProducts([])
        setPosts([])
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <WhatsAppButton />
      <HeroSection />
      <WhyChooseSection />
      <FeaturedProducts products={products} />
      <SocialProofSection />
      <TestimonialsSection />
      <GallerySection />
      <ServicesSection />
      <BlogSection posts={posts} />
      <CTASection />
      <Footer />
    </div>
  )
}
