import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/modules/demo/service/node.service';
import { TreeNode} from 'primeng/api';

@Component({
    templateUrl: './treedemo.component.html'
})
export class TreeDemoComponent implements OnInit {

    files1: TreeNode<any> | TreeNode<any>[] | any[] | any;

    files2: TreeNode<any> | TreeNode<any>[] | any[] | any;

    files3: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles1: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles2: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles3: TreeNode | any = {};

    cols: any[] = [];

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then(files => this.files1 = files);
        this.nodeService.getFilesystem().then(files => this.files2 = files);
        this.nodeService.getFiles().then(files => {
            this.files3 = [{
                label: 'Root',
                children: files
            }];
        });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    }
}
