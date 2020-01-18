// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@webgpu/types/dist/index.d.ts" />

import vert from './shaders/basic.vert';
import frag from './shaders/basic.frag';

const setup_canvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = '#EEEEEE';
    document.body.append(canvas);
    return canvas;
};

const canvas_resize = (canvas: HTMLCanvasElement): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

(async (): Promise<void> => {
    const canvas = setup_canvas();

    // https://alain.xyz/blog/raw-webgpu
    //entry to WebGPU
    const entry: GPU = navigator.gpu as GPU;
    if (!entry) {
        throw new Error('WebGPU is not support on this browser.');
    }

    const adapter = await entry.requestAdapter();
    const device: GPUDevice = await adapter.requestDevice();
    const queue: GPUQueue = device.defaultQueue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context: GPUCanvasContext = canvas.getContext('gpupresent') as any;

    let swapchain: GPUSwapChain;
    let depth_texture_view: GPUTextureView;

    const resize_backings = (): void => {
        const swapchain_desc: GPUSwapChainDescriptor = {
            device: device,
            format: 'bgra8unorm',
            usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        };
        swapchain = context.configureSwapChain(swapchain_desc);

        const depth_texture_desc: GPUTextureDescriptor = {
            size: {
                width: canvas.width,
                height: canvas.height,
                depth: 1,
            },
            arrayLayerCount: 1,
            mipLevelCount: 1,
            sampleCount: 1,
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        };

        const depth_texture = device.createTexture(depth_texture_desc);
        depth_texture_view = depth_texture.createView();
    };
    resize_backings();

    let color_texture = swapchain!.getCurrentTexture();
    let color_texture_view = color_texture.createView();

    // prettier-ignore
    const vertices = new Float32Array([
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0,
         0.0,  1.0,  0.0
    ]);

    // prettier-ignore
    const colors = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ])

    const indices = new Uint16Array([0, 1, 2]);

    const create_buffer = (arr: Float32Array | Uint16Array, usage: number): GPUBuffer => {
        const desc = {size: arr.byteLength, usage};
        const [buffer, buffer_mapped] = device.createBufferMapped(desc);
        const write_array =
            arr instanceof Uint16Array ? new Uint16Array(buffer_mapped) : new Float32Array(buffer_mapped);
        write_array.set(arr);
        buffer.unmap();
        return buffer;
    };

    const vertex_buffer = create_buffer(vertices, GPUBufferUsage.VERTEX);
    const color_buffer = create_buffer(colors, GPUBufferUsage.VERTEX);
    const index_buffer = create_buffer(indices, GPUBufferUsage.INDEX);

    const vert_desc: GPUShaderModuleDescriptor = {code: vert};
    const vert_module = device.createShaderModule(vert_desc);

    const frag_desc: GPUShaderModuleDescriptor = {code: frag};
    const frag_module = device.createShaderModule(frag_desc);

    //grahpics pipeline
    const vertex_attrib_desc: GPUVertexAttributeDescriptor = {
        shaderLocation: 0,
        offset: 0,
        format: 'float3',
    };
    const color_attrib_desc: GPUVertexAttributeDescriptor = {
        shaderLocation: 1,
        offset: 0,
        format: 'float3',
    };
    const vertex_buffer_desc: GPUVertexBufferLayoutDescriptor = {
        attributes: [vertex_attrib_desc],
        arrayStride: 4 * 3,
        stepMode: 'vertex',
    };
    const color_buffer_desc: GPUVertexBufferLayoutDescriptor = {
        attributes: [color_attrib_desc],
        arrayStride: 4 * 3,
        stepMode: 'vertex',
    };
    const vertex_state: GPUVertexStateDescriptor = {
        indexFormat: 'uint16',
        vertexBuffers: [vertex_buffer_desc, color_buffer_desc],
    };

    //shader modules
    const vertex_stage = {
        module: vert_module,
        entryPoint: 'main',
    };
    const fragment_stage = {
        module: frag_module,
        entryPoint: 'main',
    };

    //depth/stencil state
    const depth_stencil_state: GPUDepthStencilStateDescriptor = {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus-stencil8',
    };

    //blend state
    const color_state: GPUColorStateDescriptor = {
        format: 'bgra8unorm',
        alphaBlend: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
        },
        colorBlend: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
        },
        writeMask: GPUColorWrite.ALL,
    };

    //rasterization
    const rasterization_state: GPURasterizationStateDescriptor = {
        frontFace: 'cw',
        cullMode: 'none',
    };

    const pipeline_layout_desc = {bindGroupLayouts: []};
    const layout = device.createPipelineLayout(pipeline_layout_desc);

    const pipeline_desc: GPURenderPipelineDescriptor = {
        layout: layout,
        vertexStage: vertex_stage,
        fragmentStage: fragment_stage,
        primitiveTopology: 'triangle-list',
        colorStates: [color_state],
        depthStencilState: depth_stencil_state,
        vertexState: vertex_state,
        rasterizationState: rasterization_state,
    };
    const pipeline = device.createRenderPipeline(pipeline_desc);

    const encode_commands = (): void => {
        const color_attachment: GPURenderPassColorAttachmentDescriptor = {
            attachment: color_texture_view,
            loadValue: {r: 0, g: 0, b: 0, a: 1},
            storeOp: 'store',
        };

        const depth_attachment: GPURenderPassDepthStencilAttachmentDescriptor = {
            attachment: depth_texture_view,
            depthLoadValue: 1,
            depthStoreOp: 'store',
            stencilLoadValue: 'load',
            stencilStoreOp: 'store',
        };

        const render_pass_desc: GPURenderPassDescriptor = {
            colorAttachments: [color_attachment],
            depthStencilAttachment: depth_attachment,
        };

        const command_encoder = device.createCommandEncoder();

        const pass_encoder = command_encoder.beginRenderPass(render_pass_desc);
        pass_encoder.setPipeline(pipeline);
        pass_encoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        pass_encoder.setScissorRect(0, 0, canvas.width, canvas.height);
        pass_encoder.setVertexBuffer(0, vertex_buffer);
        pass_encoder.setVertexBuffer(1, color_buffer);
        pass_encoder.setIndexBuffer(index_buffer);
        pass_encoder.drawIndexed(3, 1, 0, 0, 0);
        pass_encoder.endPass();

        queue.submit([command_encoder.finish()]);
    };

    const render = (): void => {
        color_texture = swapchain.getCurrentTexture();
        color_texture_view = color_texture.createView();

        encode_commands();

        requestAnimationFrame(render);
    };
    render();

    window.addEventListener(
        'resize',
        () => {
            canvas_resize(canvas);
            resize_backings();
        },
        false,
    );
})();
